from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, serializers
from django.core.paginator import Paginator
from ..serializers import UserSerializer, TransactionSerializer, IncomeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models import Transaction, Income, TotalBudget
from rest_framework.generics import CreateAPIView, ListCreateAPIView, DestroyAPIView
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters
from decimal import Decimal


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class TransactionCreateView(CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]


class TransactionListView(ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["timestamp"]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(user=user)


class TransactionStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # only get expenses
        expenses = (
            Transaction.objects.filter(
                user=user, amount__lt=0  # less than 0 to get only expenses
            )
            .values("category")
            .annotate(total_amount=Sum("amount"))  # Sum amounts for each category
            .values("category", "total_amount")
        )

        # Format the response data
        stats = [
            {
                "category": expense["category"],
                "amount": abs(
                    float(expense["total_amount"])
                ),  # Convert to positive number for frontend
            }
            for expense in expenses
        ]

        return Response(stats, status=200)


class TransactionDeleteView(DestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]


class IncomeListCreateView(ListCreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Income.objects.all().order_by("-date")


class TotalBudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total_budget = TotalBudget.objects.filter(user=user).first()

        if total_budget:
            return Response(
                {"total_budget": str(total_budget.total_budget)}, status=200
            )
        else:
            return Response(
                {"total_budget": "0"}, status=200
            )  # Default to 0 if not set
