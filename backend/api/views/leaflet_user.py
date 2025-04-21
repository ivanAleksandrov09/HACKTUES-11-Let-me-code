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

prompt = """Extract supermarket deals from PDF leaflets following these rules:

1. INPUT VALIDATION:
   - Validate input contains:
     * Common grocery/household items
     * 2-50 characters length
     * Letters, spaces, numbers
   - If invalid, return [{"info": "Invalid request", "discount": 0, "supermarket": "x"}]

2. DEAL PROCESSING:
   - Search for products containing the input term (case-insensitive)
   - Format: '[Product Name] - [Current Price] лв (Was: [Original Price] лв)'
   - Include the supermarket name you got the deal from to the "supermarket" property (lidl or kaufland)
   - Include any products that:
     * Match the search term partially or fully
     * Have a clear current and original price
   - Maximum 10 relevant results
   - Never return a product if unsure about it's name
   - No results = return [{"info": "No deals found", "discount": 0, "supermarket": ""}]

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

        kaufland_fetch_date = cache.get("last_fetch_timestamp_kaufland")
        lidl_fetch_date = cache.get("last_fetch_timestamp_lidl")

        kaufland_files = cache.get(f"{kaufland_fetch_date}_kaufland")
        lidl_files = cache.get(f"{lidl_fetch_date}_lidl")

        if not kaufland_files or not lidl_files:
            return Response({"error": "Leaflet files not available"}, status=400)

        if not user_prompt:
            return Response({"error": "Search prompt is required"}, status=400)

        # Use the fresh uploads
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[
                prompt,
                kaufland_files,
                lidl_files,
                user_prompt,
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": deals_schema,
            },
        )

        return Response({"response": json.loads(response.text)}, status=201)
