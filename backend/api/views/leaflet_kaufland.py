import io
import json
import urllib.request
from datetime import datetime, timedelta

import requests
from bs4 import BeautifulSoup
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .client import client

prompt = """Analyze the PDF leaflets carefully and extract exactly 5 deals with the highest percentage discounts. For each deal:
1. In the 'info' field, include:
   - The exact product name
   - Original price in BGN
   - Discounted price in BGN
   Format as: '{product name} - was {original_price} BGN, now {new_price} BGN'

2. In the 'discount' field:
   - Calculate the exact percentage discount
   - Return as a number (e.g., 50 for 50% discount)
   - Round to nearest whole number

3. Set 'supermarket' field to 'Kaufland'

Focus on products with clear before/after prices and significant discounts.
Exclude deals where the discount cannot be precisely calculated.
Format numbers with 2 decimal places for prices.
Sort deals by discount percentage in descending order.
Return only the top 5 deals matching this criteria.
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


# Fetch the leaflets from supported websites
class LeafletKauflandView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cache_files_used = False

        request_date = datetime.now().date()
        formatted_date = request_date.strftime("%Y-%m-%d")

        cache_key_files = f"{formatted_date}_kaufland"
        last_fetch_key = "last_fetch_timestamp_kaufland"

        last_fetch = cache.get(last_fetch_key)
        if last_fetch:
            last_fetch = datetime.strptime(last_fetch, "%Y-%m-%d").date()
        else:
            last_fetch = None

        files = []
        # Check whether enough time has passed before refetching best deals and leaflets (1 week)
        if last_fetch and (request_date - last_fetch) < timedelta(days=7):

            # If there is no need to refetch anything
            if best_deals := json.loads(cache.get(f"{last_fetch}_kaufland_deals")):
                return Response({"response": best_deals}, status=200)

            cache_files_used = True
            cache_key = last_fetch
            files = cache.get(f"{cache_key}_kaufland")
        else:
            url = "https://www.kaufland.bg/broshuri.html"
            try:
                page = requests.get(url)
            except:
                raise Exception("Couldn't access kaufland download page.")

            soup = str(BeautifulSoup(page.text, "html.parser"))

            returned_urls = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    soup,
                    "In the attached html script you can access the leaflets webpage of a supermarket. I need you to extract the download urls for each pdf leaflet from it. Please don't explain your thought process and provide only the urls separated by commas.",
                ],
            )

            urls = returned_urls.text.split(",")

            # remove newlines added from split method
            urls = [url.strip() for url in urls]

            for current_url in urls:
                # download the pdf leaflet
                downloaded_pdf = requests.get(current_url, timeout=120)
                downloaded_pdf.raise_for_status()
                file_bytes = downloaded_pdf.content

                try:
                    ai_uploaded_file = client.files.upload(
                        file=(io.BytesIO(file_bytes)),
                        config={"mime_type": "application/pdf"},
                    )
                    files.append(ai_uploaded_file)
                except Exception as e:
                    print(f"Error uploading file to client: {e}")
                    continue

        # After files are ready, we use them here
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
