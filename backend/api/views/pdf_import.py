import io
from openai import OpenAI
import json
from .open_ai import client
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from ..models import Transaction


transaction_schema = {
    "type": "object",
    "properties": {
        "amount": {"type": "number", "description": "The transaction amount"},
        "timestamp": {
            "type": "string",
            # RFC 3339 - standart format for date string
            "description": "The transaction date and time RFC: 3339",
        },
        "category": {
            "type": "string",
            "enum": [
                "business services",
                "shopping",
                "entertainment",
                "groceries",
                "eating out",
                "bills",
                "transport",
                "health",
                "travel",
                "finance",
                "general",
            ],
            "description": "The transaction category",
        },
        "particulars": {
            "type": "string",
            "description": "Additional details about the transaction",
        },
        "currency": {
            "type": "string",
            "description": "Currency of the transaction (3-letter code)",
        },
    },
    "required": ["amount", "timestamp", "category", "particulars", "currency"],
    "additionalProperties": False,
}


class UploadBankStatementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        if "file" not in request.FILES:
            return Response({"error": "No file uploaded"}, status=400)

        uploaded_file = request.FILES["file"]

        if not uploaded_file.name.lower().endswith(".pdf"):
            return Response({"error": "Uploaded file is not a PDF"}, status=400)

        file_bytes = uploaded_file.read()

        ai_uploaded_file = client.files.create(
            file=(uploaded_file.name, io.BytesIO(file_bytes)), purpose="user_data"
        )

        response = client.responses.create(
            model="gpt-4o-mini",
            input=[
                {
                    "role": "system",
                    "content": "In the pdf file is provided a bank statement. Provide me with the statements as I described you.",
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "input_file", "file_id": ai_uploaded_file.id},
                        {
                            "type": "input_text",
                            "text": "Please extract the transactions from the bank statement and provide them in JSON format. The JSON should contain an array of transactions, each with the following fields: amount, timestamp, category, particulars, and currency.",
                        },
                    ],
                },
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "transactions",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "steps": {"type": "array", "items": transaction_schema}
                        },
                        "required": ["steps"],
                        "additionalProperties": False,
                    },
                    "strict": True,
                },
            },
            timeout=10,
        )

        Transaction.objects.bulk_create(
            [
                Transaction(
                    amount=transaction["amount"],
                    timestamp=transaction["timestamp"],
                    category=transaction["category"],
                    particulars=transaction["particulars"],
                    currency=transaction.get("currency", "USD"),
                    user=request.user,
                )
                for transaction in json.loads(response.output_text)["steps"]
            ]
        )

        return Response({"response": json.loads(response.output_text)})
