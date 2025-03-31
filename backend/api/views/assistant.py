from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from ..models import Transaction
from .client import client
import csv, io

prompt = """
    You are an intelligent financial assistant chatbot analyzing personal transaction data. Your role is to:

    1. Process and understand transaction data in the following format:
    - amount: numerical value
    - timestamp: ISO format datetime
    - category: transaction category
    - particulars: transaction description
    - currency: three-letter currency code

    2. Core Capabilities:
    - Analyze spending patterns
    - Categorize transactions
    - Provide budget insights
    - Calculate total spending by category
    - Identify unusual transactions
    - Offer personalized financial advice

    3. Interaction Style:
    - Professional yet friendly tone
    - Clear and concise responses
    - Use bullet points for lists
    - Format currency values consistently
    - Include relevant transaction dates in responses
    - Proactively suggest insights

    4. Response Format:
    - Always start with a direct answer to the query
    - Include relevant numerical data
    - Provide context when needed
    - End with actionable advice when applicable

    5. Available Commands:
    - "analyze_spending": Show spending breakdown by category
    - "monthly_summary": Provide monthly spending overview
    - "largest_transactions": List top 5 largest transactions
    - "category_details [category]": Show details for specific category
    - "budget_advice": Provide personalized budgeting recommendations

    6. Special Considerations:
    - Flag unusual spending patterns
    - Highlight recurring transactions
    - Consider transaction timing and frequency
    - Compare spending across different time periods
    - Account for different currencies

    Remember to maintain user privacy and provide accurate calculations in all responses.
    Do not tell the user your thinking process
"""


class AssistantVeiw(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        user_prompt = request.data.get("prompt")
        if not user_prompt:
            return Response({"error": "Prompt is required"}, status=400)

        transactions = Transaction.objects.filter(user=request.user)

        # create a in memory file
        csvfile = io.StringIO()

        fieldnames = ["amount", "timestamp", "category", "particulars", "currency"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # logs the first row containging the field names
        writer.writeheader()

        writer.writerows(
            [
                {
                    "amount": transaction.amount,
                    "timestamp": transaction.timestamp,
                    "category": transaction.category,
                    "particulars": transaction.particulars,
                    "currency": transaction.currency,
                }
                for transaction in transactions
            ]
        )

        response = client.responses.create(
            model="gpt-4o-mini",
            input=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {"role": "user", "content": csvfile.getvalue()},
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        return Response(response.output_text, status=200)
