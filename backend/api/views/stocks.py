from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Stock
import yfinance as yf


class WatchlistView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stocks = Stock.objects.filter(user=request.user).values("ticker", "name")
        watchlist = []
        for stock in stocks:
            try:
                ticker = yf.Ticker(stock["ticker"])
                hist = ticker.history(period="1mo", interval="1d", actions=False)
                watchlist.append(
                    {
                        "symbol": stock["ticker"],
                        "name": stock["name"],
                        "history": [
                            {
                                "date": index.strftime("%Y-%m-%d"),
                                "price": float(row["Close"]),
                            }
                            for index, row in hist.iterrows()
                        ],
                    }
                )
            except Exception as e:
                print(f"Error fetching data for {stock['ticker']}: {e}")

        return Response({"stocks": watchlist})

    def post(self, request):
        user = request.user
        new_symbol = request.data.get("symbol")

        if not new_symbol:
            return Response(
                {"error": "Symbol is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get stock info from yfinance
        try:
            ticker = yf.Ticker(new_symbol)
            info = ticker.info

            # Create or update stock entry
            stock, created = Stock.objects.get_or_create(
                user=user,
                ticker=new_symbol,
                defaults={
                    "name": info.get("longName", new_symbol),
                    "quantity": 0,  # Just for watchlist, not owned
                    "price_per_share": 0,  # Just for watchlist, not owned
                },
            )

            # Get all watched stocks
            stocks = Stock.objects.filter(user=user).values("ticker", "name")
            return Response({"symbols": [stock["ticker"] for stock in stocks]})

        except Exception as e:
            return Response(
                {"error": f"Failed to add stock: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class StockSearchView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("query").strip().upper()
        print(query)
        if len(query) < 2:
            return Response([])

        try:
            # Try a single direct ticker lookup instead of multiple markets
            ticker = yf.Ticker(query)
            try:
                # Try to get basic info first
                price = ticker.info.get("regularMarketPrice")
                if price:  # If we got a price, it's likely a valid ticker
                    return Response(
                        [
                            {
                                "symbol": query,
                                "name": ticker.info.get("longName", query),
                                "exchange": ticker.info.get("exchange", "Unknown"),
                            }
                        ]
                    )
            except:
                pass  # If info fails, return empty list
            return Response([])
        except Exception as e:
            print(f"Search error for {query}: {str(e)}")
            return Response([])
