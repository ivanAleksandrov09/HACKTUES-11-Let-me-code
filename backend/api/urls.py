from django.urls import path
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView
from .views.assistant import AssistantVeiw
from .views.views import TransactionListView
from .views.stocks import PurchasedStocksView


urlpatterns = [
    path("transactions", TransactionListView.as_view()),
    path("bank-statement", UploadBankStatementView.as_view()),
    path("summary", UserSummaryView.as_view()),
    path("assistant", AssistantVeiw.as_view()),
    path("stocks", PurchasedStocksView.as_view()),
]
