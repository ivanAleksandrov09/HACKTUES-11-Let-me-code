from google import genai
from django.conf import settings

client = genai.Client(api_key=settings.API_KEY)
