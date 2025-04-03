import requests
from bs4 import BeautifulSoup
from .client import client
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.cache import cache
import requests
import urllib.request
from datetime import datetime, timedelta


# Fetch the leaflets from supported websites
class LeafletView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        request_date = datetime.today()

        cache_key = f"{request_date}"
        last_fetch_key = "last_fetch_timestamp"

        last_fetch = cache.get(last_fetch_key)

        if last_fetch and (request_date - last_fetch) < timedelta(days=7):
            cache_key = last_fetch
            return Response(
                cache.get(cache_key), status=200, headers={"X-Cache": "HIT"}
            )

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
            # download the pdf leaflet
            file_bytes = urllib.request.urlopen(current_url).read()

            ai_uploaded_file = client.files.upload(
                file=(io.BytesIO(file_bytes)),
                config={"mime_type": "application/pdf"},
            )

            files.append(ai_uploaded_file)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                files,
                "I want you to list the 5 biggest discounts you find from the given leaflets. Don't explain your thought process.",
            ],
        )

        cache.set(last_fetch_key, request_date, timeout=14 * 24 * 60 * 60)
        cache.set(cache_key, response.text, timeout=14 * 24 * 60 * 60)

        return Response({"response": response.text}, status=201)
