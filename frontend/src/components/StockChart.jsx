import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ symbol }) => {
    // Mock historical data for demonstration
    const generateMockData = () => {
        const data = [];
        let price = Math.random() * 100;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            price = price * (1 + (Math.random() - 0.5) * 0.1);
            data.push({
                date: date.toLocaleDateString(),
                price: parseFloat(price.toFixed(2))
            });
        }
        return data;
    };

    const data = generateMockData();
    const isPositive = data[data.length - 1].price > data[0].price;
    const lineColor = isPositive ? "#4CAF50" : "#f44336";

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                />
                <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockChart;