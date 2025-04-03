from rest_framework.views import APIView
from ..models import Stock
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import yfinance as yf
from datetime import datetime


class PurchasedStocksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stocks = Stock.objects.filter(user=request.user)

        stock_tickers = [stock.ticker for stock in stocks]

        if not stock_tickers:
            return Response(
                {"error": "No stocks found for this user"},
                status=404,
            )

        try:
            stock_data = {}

            for symbol in stock_tickers:
                stock_info = self.scrape_stock_data(symbol.strip(), stocks)
                if stock_info:
                    stock_data[symbol] = stock_info

            if not stock_data:
                return Response(
                    {"error": "Could not retrieve stock data"},
                    status=404,
                )

            return Response(
                {"timestamp": datetime.now().isoformat(), "data": stock_data},
                status=200,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def scrape_stock_data(self, symbol, stocks):
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            stock_data = {
                "name": info.get("shortName", symbol),
                "quantity": stocks.filter(ticker=symbol).first().quantity,
                "price_per_share": info.get("currentPrice", 0),
                # isoformat - standard format for the date
                "last_updated": datetime.now().isoformat(),
            }

            return stock_data

        except Exception as e:
            return Response({"error": str(e)}, status=500)
