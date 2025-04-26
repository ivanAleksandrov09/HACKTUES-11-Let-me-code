import io
import json
from datetime import datetime, timedelta

import requests
import requests.adapters
from bs4 import BeautifulSoup
from django.core.cache import cache
from PyPDF2 import PdfReader, PdfWriter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .client import client

PDF_CHUNKS = 2

leaflet_info_schema = {
    "type": "array",
    "items": {
        "type": "string",
    },
}

prompt = """Analyze the PDF leaflets carefully and extract exactly 5 deals with the highest percentage discounts. For each deal:

1. PRIORITY ITEMS (in order):
   - Common groceries (food, beverages)
   - Household essentials (cleaning, hygiene)
   - Fresh produce and meats
   - Other supermarket items

2. Product Information Requirements:
   - Full product name with brand
   - Package size/weight/volume
   - Product variety/type (if applicable)
   - Format as: '{brand} {product name} {variety} {size} - was {original_price} BGN, now {new_price} BGN'


Sort by discount percentage (highest first) among common items.
Return exactly 5 deals matching these criteria.

2. In the 'discount' field:
   !!! ALWAYS MAKE SURE THE DEALS YOU ARE EXTRACTING HAVE CLEARLY STATED BEFORE PRICES!!!
   - Calculate the exact percentage discount
   - Return as a number (e.g., 50 for 50% discount)
   - Round to nearest whole number

3. Set 'supermarket' field to 'Kaufland'

4. Validation Rules:
   - Only extract deals with clear before/after prices
   - Must include complete product details
   - Skip items with ambiguous descriptions
   - Focus on everyday supermarket items over specialty products
"""

deals_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "info": {
                "type": "string",
                "description": "Information about the deal, including item name, previous price and new price.",
            },
            "discount": {
                "type": "number",
                "description": "Discount amount in percentages such as 50%.",
            },
            "supermarket": {"type": "string", "description": "Name of the supermarket"},
        },
        "required": ["info", "discount", "supermarket"],
    },
}


def get_leaflet_page_info(url):
    try:
        page = requests.get(url)
    except:
        raise Exception("Couldn't access LIDL home page.")
    soup = str(BeautifulSoup(page.text, "html.parser"))

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            soup,
            """In the attached html script you can see the webpage of a supermarket. 
            I need you to find the URLs for the weekly leaflets, from which I want you to
            extract the leaflet IDs from the URLs (likely in the date format 00-00-00-00-cccccc).
            Return an array of IDs.
            Don't format the response or explain your thought process.""",
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": leaflet_info_schema,
        },
    )

    return json.loads(response.text)


class LidlLeafletView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cache_files_used = False

        request_date = datetime.now().date()
        formatted_date = request_date.strftime("%Y-%m-%d")

        cache_key_files = f"{formatted_date}_lidl"
        last_fetch_key = "last_fetch_timestamp_lidl"

        last_fetch = cache.get(last_fetch_key)
        if last_fetch:
            last_fetch = datetime.strptime(last_fetch, "%Y-%m-%d").date()
        else:
            last_fetch = None

        files = []
        # Check whether enough time has passed before refetching best deals and leaflets (1 week)
        if last_fetch and (request_date - last_fetch) < timedelta(days=7):

            # If there is no need to refetch anything
            if best_deals := json.loads(cache.get(f"{last_fetch}_lidl_deals")):
                return Response({"response": best_deals}, status=200)

            cache_files_used = True
            cache_key = last_fetch
            files = cache.get(f"{cache_key}_lidl")
        else:
            # Try to find the unique url for the leaflet
            url = "https://www.lidl.bg/c/broshura/s10020060"

            leaflet_ids = get_leaflet_page_info(url)

            for leaflet_id in leaflet_ids:
                # We construct the URL for the initial leaflet request to LIDLs endpoint
                # and then fetch the PDF URL for the leaflet
                # before downloading it

                constructed_url = f"https://endpoints.leaflets.schwarz/v4/flyer?flyer_identifier={leaflet_id}&region_id=0&region_code=0"
                try:
                    response = requests.get(constructed_url)
                except:
                    print("Couldn't construct leaflet PDF url.\n")
                    continue

                pdf_url = response.json()["flyer"]["pdfUrl"]
                print(f"Found LIDL PDF leaflet: {pdf_url}")

                # Create a session with retry mechanism
                session = requests.Session()
                adapter = requests.adapters.HTTPAdapter(
                    max_retries=requests.adapters.Retry(
                        total=5,
                        backoff_factor=0.5,
                        status_forcelist=[500, 502, 503, 504],
                    ),
                    pool_connections=20,
                    pool_maxsize=20,
                )
                session.mount("http://", adapter)
                session.mount("https://", adapter)

                # download the pdf leaflet with extended timeout
                try:
                    downloaded_pdf = session.get(
                        pdf_url,
                        timeout=(60, 600),  # (connect timeout, read timeout)
                        stream=True,
                    )
                    downloaded_pdf.raise_for_status()

                    # Download in smaller chunks
                    chunks = []
                    for chunk in downloaded_pdf.iter_content(
                        chunk_size=256 * 1024
                    ):  # 256KB chunks
                        if chunk:
                            chunks.append(chunk)
                    file_bytes = b"".join(chunks)

                    # ai_uploaded_file = client.files.upload(
                    #     file=(io.BytesIO(file_bytes)),
                    #     config={"mime_type": "application/pdf"},
                    # )
                    # files.append(ai_uploaded_file)

                    # split the pdf into chunks and upload it

                    pdf_reader = PdfReader(io.BytesIO(file_bytes))
                    total_pages = len(pdf_reader.pages)
                    chunk = total_pages // PDF_CHUNKS

                    for part in range(PDF_CHUNKS):
                        pdf_writer = PdfWriter()
                        start_page = part * chunk
                        end_page = min((part + 1) * chunk, total_pages)

                        if start_page >= total_pages:
                            break

                        for page_num in range(start_page, end_page):
                            pdf_writer.add_page(pdf_reader.pages[page_num])

                        output_bytes = io.BytesIO()
                        pdf_writer.write(output_bytes)
                        # seek - sets the stream position to beginning
                        output_bytes.seek(0)

                        # Set default timeout for the client call
                        client.timeout = 300  # 5 minute timeout

                        ai_uploaded_file = client.files.upload(
                            file=output_bytes,
                            config={"mime_type": "application/pdf"},
                        )
                        files.append(ai_uploaded_file)

                except requests.exceptions.ConnectTimeout:
                    print(f"Connection timeout while downloading PDF from {pdf_url}")
                    continue
                except requests.exceptions.ReadTimeout:
                    print(f"Read timeout while downloading PDF from {pdf_url}")
                    continue
                except Exception as e:
                    print(f"Error processing/uploading file: {str(e)}")
                    print(f"Error type: {type(e)}")
                    print(
                        f"Error details: {str(e.__dict__)}"
                    )  # Added more error details
                    continue

        # After downloading PDFs, we analyze them here
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                files,
                prompt,
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": deals_schema,
            },
        )

        if not cache_files_used:
            cache.set(last_fetch_key, formatted_date, timeout=14 * 24 * 60 * 60)
            cache.set(cache_key_files, files, timeout=14 * 24 * 60 * 60)

        cache.set(f"{cache_key_files}_deals", response.text, timeout=14 * 24 * 60 * 60)

        try:
            parsed_response = json.loads(response.text)
            cache.set(
                f"{cache_key_files}_deals", response.text, timeout=14 * 24 * 60 * 60
            )
            return Response({"response": parsed_response}, status=200)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            print(f"Response text: {response.text}")
            return Response(
                {"error": "Invalid JSON response from AI model"}, status=500
            )
