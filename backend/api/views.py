from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, serializers
from .serializers import UserSerializer, TransactionSerializer, IncomeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView, ListCreateAPIView, DestroyAPIView
from .models import Transaction, Income
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.views import APIView
from decimal import Decimal
from .models import TotalBudget

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class TransactionCreateView(CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

class TransactionListView(ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

class TransactionDeleteView(DestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

class IncomeListCreateView(ListCreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Income.objects.all().order_by('-date')



class TotalBudgetView(APIView):
    def get(self, request):
        total = TotalBudget.objects.first()
        if not total:
            total = TotalBudget.objects.create(amount=0.00)
        return Response({'total_budget': float(total.amount)})

    def post(self, request):
        try:
            amount = request.data.get('amount')
            if amount is None:
                return Response({'error': 'Amount is required'}, status=400)
            
            total = TotalBudget.objects.first()
            if not total:
                total = TotalBudget.objects.create(amount=0.00)
            
            total.amount += Decimal(str(amount))
            total.save()
            
            return Response({
                'total_budget': float(total.amount),
                'message': 'Budget updated successfully'
            })
        except (ValueError, TypeError):
            return Response({'error': 'Invalid amount format'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    