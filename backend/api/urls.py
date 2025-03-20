from django.urls import path
from . import views
from .pdf_import import UploadBankStatementView

urlpatterns = [path("bank-statement", UploadBankStatementView.as_view())]
