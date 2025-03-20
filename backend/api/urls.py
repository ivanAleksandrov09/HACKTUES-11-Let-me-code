from django.urls import path
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView

urlpatterns = [
    path("bank-statement", UploadBankStatementView.as_view()),
    path("summary", UserSummaryView.as_view()),
]
