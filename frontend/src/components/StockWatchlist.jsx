import React, { useState, useEffect } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StockWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    const response = await api.get("/api/stocks/watchlist/");
    setWatchlist(response.data.stocks || []);
  };

  const searchStocks = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await api.get(`/api/stocks/search/`, {
        params: { query },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setNewSymbol(value);
    searchStocks(value);
  };

  const handleSelectStock = async (stock) => {
    try {
      await api.post("/api/stocks/watchlist/", { symbol: stock.symbol });
      await loadWatchlist(); // Refresh the watchlist from backend
      setSearchResults([]);
      setNewSymbol("");
    } catch (error) {
      console.error("Failed to add stock:", error);
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={newSymbol}
          onChange={handleSearchChange}
          placeholder="Search stock symbol or name..."
          className="w-full p-2 border rounded"
        />
        {isSearching && (
          <div className="text-sm text-gray-500">Searching...</div>
        )}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-b shadow-lg">
            {searchResults.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="font-bold">{stock.symbol}</span> -{" "}
                <span>{stock.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="charts-container mt-4">
        {watchlist.map((stock) => (
          <div key={stock.symbol} className="chart-item">
            <h3>
              {stock.name} ({stock.symbol})
            </h3>
            <div className="chart">
              <LineChart width={600} height={300} data={stock.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockWatchlist;
