from api.views.stocks import StockSearchView, WatchlistView
from django.urls import path

from .views.assistant import AssistantView
from .views.leaflet_kaufland import LeafletKauflandView
from .views.leaflet_lidl import LidlLeafletView
from .views.leaflet_user import LeafletUserView
from .views.pdf_import import UploadBankStatementView
from .views.user_summary import UserSummaryView
from .views.views import (
    GetProfileView,
    TransactionDeleteView,
    TransactionListView,
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
    path(
        "transaction-stats/", TransactionStatsView.as_view(), name="transaction-stats"
    ),
    path("leaflet/lidl/", LidlLeafletView.as_view()),
    path("leaflet/kaufland/", LeafletKauflandView.as_view()),
    path("leaflet/user/", LeafletUserView.as_view()),
    path("user/profile/", GetProfileView.as_view()),
    path("chat/", AssistantView.as_view()),
    path("stocks/watchlist/", WatchlistView.as_view(), name="watchlist"),
    path("stocks/search/", StockSearchView.as_view(), name="search_stocks"),
]
