from django.urls import path
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView
from .views.leaflet import LeafletView
from .views.views import (
    TransactionListView,
    TransactionDeleteView,
    TransactionStatsView,
    GetProfileView,
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
    path(
        "transaction-stats/", TransactionStatsView.as_view(), name="transaction-stats"
    ),
    path("leaflet", LeafletView.as_view()),
    path("user/profile/", GetProfileView.as_view()),
]
