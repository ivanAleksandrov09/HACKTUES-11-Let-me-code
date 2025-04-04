import io
import urllib.request
from datetime import datetime, timedelta

import requests
from bs4 import BeautifulSoup
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request

from .client import client

prompt = """Analyze the provided PDF leaflets and extract deal information following these strict rules:

1. FORMAT RULES:
   - Always return results as an array of strings
   - Each deal format: '[Product Name] - [Current Price] лв (Original: [Old Price] лв, Save [Discount]%)'
   - Round all prices to 2 decimal places
   - Calculate discount percentage as: ((Old Price - Current Price) / Old Price) * 100
   - Round discount percentage to nearest whole number

2. RESPONSE TYPES:
   - For 'best deal' or 'best promotion': Return array with single item having highest discount percentage
   - For 'best deals': Return array with top 3 items sorted by discount percentage (descending)
   - For product search queries: Return array with up to 3 most relevant matching items
   - If no matches found: Return ['No deals found']

3. PRODUCT EXTRACTION:
   - Extract only items with clear original and current prices
   - Ignore items without explicit discounts
   - For similar items, choose the one with higher discount percentage
   - Consider both Bulgarian and English product names
   - Include brand names when available

4. VALIDITY:
   - Only include currently valid promotions
   - Verify price formatting (must be numerical values)
   - Ensure discount percentage is between 1 and 99
"""

deals_schema = {
    "type": "array",
    "items": {
        "type": "string",
    },
}


# Fetch the leaflets from supported websites
class LeafletUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, *args, **kwargs):
        user_prompt = request.data.get("prompt")

        cache_used = False
        request_date = datetime.now().date()
        formatted_date = request_date.strftime("%Y-%m-%d")

        cache_key = f"{formatted_date}"
        last_fetch_key = "last_fetch_timestamp"

        last_fetch = cache.get(last_fetch_key)
        if last_fetch:
            last_fetch = datetime.strptime(last_fetch, "%Y-%m-%d").date()
        else:
            last_fetch = None

        if last_fetch and (request_date - last_fetch) < timedelta(days=7):
            cache_used = True
            cache_key = last_fetch
            files = cache.get(cache_key)
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

            files = []
            for current_url in urls:
                try:
                    # download the pdf leaflet
                    file_bytes = urllib.request.urlopen(current_url).read()

                    ai_uploaded_file = client.files.upload(
                        file=(io.BytesIO(file_bytes)),
                        config={"mime_type": "application/pdf"},
                    )

                    files.append(ai_uploaded_file)
                except (urllib.error.URLError, urllib.error.HTTPError) as e:
                    print(f"Skipping invalid URL {current_url}: {str(e)}")
                    continue

        # After files are ready, we use them here
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[
                files,
                prompt,
                user_prompt,
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": deals_schema,
            },
        )

        if not cache_used:
            cache.set(last_fetch_key, formatted_date, timeout=14 * 24 * 60 * 60)
            cache.set(cache_key, files, timeout=14 * 24 * 60 * 60)

        return Response({"response": response.text}, status=201)
