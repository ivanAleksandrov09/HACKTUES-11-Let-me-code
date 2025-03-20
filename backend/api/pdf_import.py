import PyPDF2
import io
from openai import OpenAI
import json
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from .models import Transaction


transaction_schema = {
    "type": "object",
    "properties": {
        "amount": {
            "type": "number",
            "description": "The transaction amount"
        },
        "timestamp": {
            "type": "string", 
            #RFC 3339 - standart format for date string
            "description": "The transaction date and time RFC: 3339"
        },
        "category": {
            "type": "string",
            "enum": [
                "business services", "shopping", "entertainment",
                "groceries", "eating out", "bills", "transport",
                "health", "travel", "finance", "general"
            ],
            "description": "The transaction category"
        },
        "particulars": {
            "type": "string",
            "description": "Additional details about the transaction"
        }
    },
    "required": ["amount", "timestamp", "category", "particulars"],
    "additionalProperties": False
}


class UploadBankStatementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                return Response({"error": "No file uploaded"}, status=400)
            
            uploaded_file = request.FILES['file']
            
            if not uploaded_file.name.lower().endswith('.pdf'):
                return Response({"error": "Uploaded file is not a PDF"}, status=400)
            
           
            file_bytes = uploaded_file.read()
            pdf_text = self.extract_text_from_pdf(file_bytes)
            if not pdf_text.strip():
                return Response({"error": "Could not extract text from PDF"}, status=400)
            
          
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            response = client.responses.create(
                model="gpt-4o-mini",
                input=[
                    {"role": "system", "content": "In the pdf file is provided a bank statement. Provide me with the statements as I described you."},
                    {"role": "user", "content": pdf_text}
                ],
                text={
                    "format": {
                        "type": "json_schema",
                        "name": "transactions",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "steps": {
                                    "type": "array",
                                    "items": transaction_schema
                                }
                            },
                            "required": ["steps"],
                            "additionalProperties": False
                        },
                        "strict": True
                    }, 
                },
                timeout=10
            )


            for transaction in json.loads(response.output_text):
                Transaction.objects.create(
                    amount=transaction['amount'],
                    timestamp=transaction['timestamp'],
                    category=transaction['category'],
                    particulars=transaction['particulars'],
                    user=request.user
                )


            return Response({
                "response": json.loads(response.output_text)
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    def extract_text_from_pdf(self, file_bytes):
        text = ""
        try:
            # turns the input bytes into a file-like object
            pdf_file = io.BytesIO(file_bytes)
            
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            # Clean up the text to join words that are incorrectly broken across lines
            text = self.clean_pdf_text(text)
                    
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""
    def clean_pdf_text(self, text):
        lines = text.split('\n')
        result = []
        current_paragraph = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_paragraph:
                    result.append(current_paragraph)
                    current_paragraph = ""
                continue
                
            # If line ends with sentence-ending punctuation, it's likely end of paragraph
            if line.endswith(('.', '!', '?', ':', ';')) or line.endswith(('-', ',')):
                current_paragraph += " " + line if current_paragraph else line
                result.append(current_paragraph)
                current_paragraph = ""
            else:
                # Otherwise append to current paragraph
                current_paragraph += " " + line if current_paragraph else line
        
        # Add any remaining text
        if current_paragraph:
            result.append(current_paragraph)
        
        return '\n\n'.join(result)
            
