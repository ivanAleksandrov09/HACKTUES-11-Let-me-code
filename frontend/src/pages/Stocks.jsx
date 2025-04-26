import React, { useState } from 'react';
import StockChart from '../components/StockChart';
import '../styles/pages/Stocks.css';

const Stocks = () => {
    // Mock data for demonstration
    const mockStocks = {
        'AAPL': {
            name: 'Apple Inc.',
            quantity: 10,
            price_per_share: 169.85,
        },
        'GOOGL': {
            name: 'Alphabet Inc.',
            quantity: 5,
            price_per_share: 155.47,
        },
        'MSFT': {
            name: 'Microsoft Corporation',
            quantity: 8,
            price_per_share: 425.52,
        },
        'TSLA': {
            name: 'Tesla, Inc.',
            quantity: 15,
            price_per_share: 168.29,
        }
    };

    const [userStocks, setUserStocks] = useState(Object.entries(mockStocks));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-stocks-container">
            <h1>Stock Performance</h1>
            <div className="stocks-grid">
                {userStocks.map(([symbol, stockData]) => (
                    <div key={symbol} className="stock-card">
                        <div className="stock-header">
                            <h2>{stockData.name} ({symbol})</h2>
                            <div className="stock-price">
                                <span>${stockData.price_per_share}</span>
                                <small>Qty: {stockData.quantity}</small>
                            </div>
                        </div>
                        <div className="stock-chart">
                            <StockChart symbol={symbol} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stocks;