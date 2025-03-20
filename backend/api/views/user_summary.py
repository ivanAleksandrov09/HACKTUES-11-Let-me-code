from rest_framework.views import APIView
from ..models import Transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from .open_ai import client
from datetime import datetime
import csv, io


class UserSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, *args, **kwargs):

        transactions = Transaction.objects.filter(user=request.user)

        from_date = request.query_params.get("from-date")

        if from_date:
            try:
                # ignore the hours and minutes
                parsed_date = datetime.strptime(from_date, "%Y-%m-%d").date()

                transactions = transactions.filter(timestamp__date__gte=parsed_date)
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # create a in memory file
        csvfile = io.StringIO()

        fieldnames = ["amount", "timestamp", "category", "particulars"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # logs the first row containging the field names
        writer.writeheader()

        # values_list returns a list of transaction dictionaries
        writer.writerows(
            [
                {
                    "amount": transaction.amount,
                    "timestamp": transaction.timestamp,
                    "category": transaction.category,
                    "particulars": transaction.particulars,
                }
                for transaction in transactions
            ]
        )

        response = client.responses.create(
            model="gpt-4o-mini",
            input=[
                {
                    "role": "system",
                    "content": "I will provide you with a list of transactions. Please give a summary of the most impactful.",
                },
                {"role": "user", "content": csvfile.getvalue()},
            ],
        )

        return Response(response.output_text, status=200)
