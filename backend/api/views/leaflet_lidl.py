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

prompt = """Extract supermarket deals from PDF leaflets following these strict validation rules:

1. INPUT VALIDATION:
   - Validate input contains:
     * Common grocery/household items
     * 2-50 characters length
     * Letters, spaces, numbers
   - If invalid, return [{"info": "Invalid request", "discount": 0, "supermarket": "x"}]

2. DEAL PROCESSING:
   - Search for products containing the input term (case-insensitive)
   - STRICT VALIDATION REQUIREMENTS:
     * MUST have clear, unambiguous current price
     * MUST have clear, unambiguous original price
     * MUST include complete product name with brand and variety when available
     * MUST be able to verify both prices are for the same product/quantity
     * MUST verify source leaflet before assigning supermarket name
   - Format: '[Full Product Name with Details] - [Current Price] лв (Was: [Original Price] лв)'
   - Include brand names and product specifics in the name when available
   - Include package size/weight when available
   - For supermarket field:
     * Use 'kaufland' ONLY for deals found in Kaufland leaflets
     * Use 'lidl' ONLY for deals found in Lidl leaflets
     * Verify leaflet source before assigning supermarket name
   - Calculate discount percentage: (original_price - current_price) / original_price * 100
   - Sort by discount percentage (highest first)
   - Maximum 10 results with highest discounts
   - Minimum discount threshold: 15%
   - REJECT ANY PRODUCT IF:
     * Any price is unclear or ambiguous
     * Cannot verify price comparison validity
     * Cannot verify supermarket source
     * Product description is incomplete

3. LANGUAGE:
   - Accept both Bulgarian and English product names
   - Use original product naming from leaflet
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

                # download the pdf leaflet
                try:
                    downloaded_pdf = requests.get(pdf_url, timeout=120)
                    downloaded_pdf.raise_for_status()
                    file_bytes = downloaded_pdf.content

                    ai_uploaded_file = client.files.upload(
                        file=(io.BytesIO(file_bytes)),
                        config={"mime_type": "application/pdf"},
                    )
                    files.append(ai_uploaded_file)

                # split the pdf into chunks and upload it
                # try:
                #     pdf_reader = PdfReader(io.BytesIO(file_bytes))
                #     total_pages = len(pdf_reader.pages)
                #     chunk = total_pages // PDF_CHUNKS

                #     for part in range(PDF_CHUNKS):
                #         pdf_writer = PdfWriter()
                #         start_page = part * chunk
                #         end_page = min((part + 1) * chunk, total_pages)

                #         if start_page >= total_pages:
                #             break

                #         for page_num in range(start_page, end_page):
                #             pdf_writer.add_page(pdf_reader.pages[page_num])

                #         output_bytes = io.BytesIO()
                #         pdf_writer.write(output_bytes)
                #         # seek - sets the stream position to beginning
                #         output_bytes.seek(0)

                #         files_content.append(output_bytes)

                #         ai_uploaded_file = client.files.upload(
                #             file=output_bytes,
                #             config={"mime_type": "application/pdf"},
                #         )
                #         files.append(ai_uploaded_file)

                except Exception as e:
                    print(f"Error processing/uploading file: {e}")
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
