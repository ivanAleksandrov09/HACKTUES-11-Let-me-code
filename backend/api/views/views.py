from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from django.core.paginator import Paginator
from ..serializers import UserSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models import Transaction


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        page_size = self.request.query_params.get("page_size", 10)

        # ensure smaller than 100 for performance and correct type
        try:
            page_size = int(page_size)
            if page_size > 100:
                page_size = 100

        except (TypeError, ValueError):
            page_size = 10

        user = self.request.user
        transactions = Transaction.objects.filter(user=user)
        transactions = Paginator(transactions, page_size)
