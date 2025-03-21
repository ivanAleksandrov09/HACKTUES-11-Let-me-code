from rest_framework.views import APIView
from ..models import Transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from .open_ai import client
from datetime import datetime
import csv, io, json
from django.core.cache import cache

insights_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "Title of the insight or pattern",
        },
        "description": {
            "type": "string",
            "description": "Detailed description of the insight or pattern",
        },
        "category": {
            "type": "string",
            "description": "Category of the insight or pattern",
        },
    },
    "required": ["title", "description", "category"],
    "additionalProperties": False,
}

prompt = """
    You are a professional financial analyst. Analyze the following transaction data and provide a comprehensive summary:

    
    1. TRANSACTION ANALYSIS
    - Calculate total income vs expenses
    - Identify spending patterns by category
    - Flag any unusual transactions (significantly higher amounts)
    - Show monthly spending trends
    - Break down expenses by category as percentages

    2. INSIGHTS & PATTERNS
    - Highlight the top 3 spending categories
    - Identify regular recurring payments
    - Note any concerning spending patterns
    - Compare essential vs non-essential spending

    3. BUDGET RECOMMENDATIONS
    - Suggest realistic monthly budget allocations by category
    - Identify areas where spending could be optimized
    - Provide specific actionable tips for reducing expenses
    - Recommend savings targets based on income

    4. FINANCIAL HEALTH INDICATORS
    - Calculate income-to-expense ratio
    - Assess emergency fund adequacy
    - Evaluate spending sustainability
    - Flag any potential cash flow issues

    Important:
    - Provide exactly 4 insights, one from each area above
    - Keep each insight concise and actionable
    - Include specific numbers and percentages where relevant
    - Focus on the most important finding from each category

    Format the response with clear sections, bullet points, 
    and include relevant percentages and amounts. 
    Present key insights at the beginning and specific recommendations at the end.
    Do not tell the user your thinking process.
    
"""


class UserSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, *args, **kwargs):
        user_id = request.user.id
        transactions = Transaction.objects.filter(user=request.user)

        from_date = request.query_params.get("from-date")
        date_filter = None

        if from_date:
            try:
                # ignore the hours and minutes
                parsed_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                transactions = transactions.filter(timestamp__date__gte=parsed_date)
                date_filter = from_date
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Generate a cache key based on user_id, date filter, and transaction count/latest timestamp
        latest_transaction = transactions.order_by("-timestamp").first()
        transaction_count = transactions.count()

        # Create a unique cache signature
        cache_key = f"user_{user_id}_date_{date_filter}_count_{transaction_count}"
        if latest_transaction:
            cache_key += f"_latest_{latest_transaction.timestamp.isoformat()}"
        print(cache_key)

        if cached_summary := cache.get(cache_key):
            # X-Cache: HIT header so we know we used the cache
            return Response(cached_summary, status=200, headers={"X-Cache": "HIT"})

        csvfile = io.StringIO()
        fieldnames = ["amount", "timestamp", "category", "particulars", "currency"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
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
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "insights",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "steps": {"type": "array", "items": insights_schema}
                        },
                        "required": ["steps"],
                        "additionalProperties": False,
                    },
                    "strict": True,
                },
            },
            timeout=10,
        )

        summary_insights_array = json.loads(response.output_text)["steps"]

        cache.set(cache_key, summary_insights_array, timeout=3 * 24 * 60 * 60)

        return Response(summary_insights_array, status=200)
