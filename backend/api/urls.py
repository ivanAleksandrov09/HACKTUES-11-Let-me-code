from django.urls import path
from .views import TransactionCreateView, TransactionListView, TransactionDeleteView, TransactionDeleteView, IncomeListCreateView, TotalBudgetView

urlpatterns = [
    path('transaction/', TransactionListView.as_view(), name='transaction-list-create'),
    path('transaction/<int:pk>/', TransactionDeleteView.as_view(), name='transaction-delete'),
    path('income/', IncomeListCreateView.as_view(), name='income-list-create'),
    path ('income/total/', TotalBudgetView.as_view(), name='total-budget'),
]
