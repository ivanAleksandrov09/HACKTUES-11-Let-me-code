from django.urls import path
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView
from .views.assistant import AssistantVeiw
from .views.stocks import PurchasedStocksView
from .views.views import (
    TransactionListView,
    TransactionDeleteView,
    TransactionStatsView,
)


urlpatterns = [
    path("transactions/", TransactionListView.as_view()),
    path(
        "transaction/<int:pk>/",
        TransactionDeleteView.as_view(),
        name="transaction-delete",
    ),
    path("bank-statement/", UploadBankStatementView.as_view()),
    path("summary/", UserSummaryView.as_view()),
    path("assistant/", AssistantVeiw.as_view()),
    path("stocks/", PurchasedStocksView.as_view()),
    path(
        "transaction-stats/", TransactionStatsView.as_view(), name="transaction-stats"
    ),
]
