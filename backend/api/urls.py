from django.urls import path
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView
from .views.leaflet_user import LeafletUserView
from .views.leaflet_base import LeafletBaseView
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
    path("leaflet/user/", LeafletUserView.as_view()),
    path("leaflet/base/", LeafletBaseView.as_view()),
    path("user/profile/", GetProfileView.as_view()),
]
