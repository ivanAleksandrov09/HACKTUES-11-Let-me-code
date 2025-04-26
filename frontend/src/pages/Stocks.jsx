import React from "react";
import StockWatchlist from "../components/StockWatchlist";

const Stocks = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>
      <StockWatchlist />
    </div>
  );
};

export default Stocks;
