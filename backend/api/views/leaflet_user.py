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

prompt = """Extract supermarket deals from Kaufland and LIDL PDF leaflets following these strict validation rules:

1. INPUT VALIDATION:
   - Validate input contains:
     * Common grocery/household items
     * 2-50 characters length
     * Letters, spaces, numbers
   - Search for both exact and partial matches
   - Consider product categories and variations
   - If invalid, return [{"info": "Invalid request", "discount": 0, "supermarket": "x"}]

2. DEAL PROCESSING:
   - CRITICAL: Maintain strict separation between Kaufland and LIDL leaflets
   - Track and verify source supermarket for EACH deal
   - Double-check supermarket source before labeling any deal
   - NEVER mix deals between supermarkets
   - Search for products containing the input term (case-insensitive)
   - Use fuzzy matching to catch similar product names and variations
   - Include category-related items (e.g., "milk" should match "whole milk", "skim milk", etc.)
   - STRICT VALIDATION REQUIREMENTS:
     * MUST have clear, unambiguous current price
     * MUST have clear, unambiguous original price
     * MUST include complete product name with brand and variety when available
     * MUST be able to verify both prices are for the same product/quantity
     * MUST correctly identify and label the source supermarket (Kaufland or LIDL)
   - Format: '[Full Product Name with Details] - [Current Price] лв (Was: [Original Price] лв)'
   - Include brand names and product specifics in the name when available
   - Include package size/weight when available
   - Supermarket property MUST match the actual leaflet source (lidl or kaufland)
   - Calculate discount percentage: (original_price - current_price) / original_price * 100
   - Sort results by:
     1. Match relevance (exact matches first)
     2. Discount percentage (highest first)
   - Maximum 10 results with highest relevance and discounts
   - Minimum discount threshold: 10%
   - REJECT ANY PRODUCT IF:
     * Any price is unclear or ambiguous
     * Cannot verify price comparison validity
     * Product description is incomplete or ambiguous
     * Cannot determine product specifics
     * Cannot verify supermarket source with 100% certainty
   - No results = return [{"info": "No deals found", "discount": 0, "supermarket": ""}]

3. LANGUAGE:
   - Accept both Bulgarian and English product names
   - Use original product naming from leaflet
   - Include both Bulgarian and English names when available
   - Handle common spelling variations and transliterations
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
                "Any deals from here should be labelled as Kaufland: ",
                kaufland_files,
                "Any deals from here should be labelled as Lidl: ",
                lidl_files,
                user_prompt,
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": deals_schema,
                "temperature": 0.3,
                "top_p": 0.8,
                "top_k": 40,
            },
        )

        return Response({"response": json.loads(response.text)}, status=201)
