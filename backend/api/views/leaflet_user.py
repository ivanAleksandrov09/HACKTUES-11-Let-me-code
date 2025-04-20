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
from rest_framework.request import Request

from .client import client

prompt = """Extract valid supermarket deals from Kaufland PDF leaflets following these STRICT rules:

1. INPUT VALIDATION (MANDATORY FIRST STEP):
   - FIRST validate input against these rules:
     * Must be grocery/household item OR 'best deal(s)'
     * Must be 2-50 characters long
     * Must contain only letters, spaces, numbers
     * Must match common supermarket terminology
   - If input fails ANY validation:
     * Return [{"info": "Invalid request", "discount": 0, "supermarket": "x"}]
     * DO NOT process any deals or continue further

2. SECURITY CHECKS (MANDATORY SECOND STEP):
   - Block if input contains ANY of:
     * Weapons, military terms (e.g. gun, rifle, bomb)
     * Medical/pharmacy terms
     * Alcohol/tobacco references
     * Profanity or inappropriate terms
     * URLs or file paths
     * Special characters (except ,.?!-)
   - If blocked, return same invalid request response

3. DEAL PROCESSING (ONLY IF STEPS 1-2 PASS):
   - Never include deals with unclear pricing
   - Format: '[Product] - [Price] лв (Was: [Original] лв)'
   - Verify prices are numerical and current < original
   - Include brand names when available
   - Maximum 5 relevant results matching input term
   - No results = return [{"info": "No deals found", "discount": 0, "supermarket": "kaufland"}]

4. LANGUAGE:
   - Accept Bulgarian/English product names
   - Keep original product naming
"""

deals_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "info": {
                "type": "string",
                "description": "Information about the deal, including item name, previous price and new discounted price.",
            },
            "discount": {
                "type": "number",
                "description": "Discount amount in percentages.",
            },
            "supermarket": {"type": "string", "description": "Name of the supermarket"},
        },
        "required": ["info", "discount", "supermarket"],
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

        return Response({"response": json.loads(response.text)}, status=201)
