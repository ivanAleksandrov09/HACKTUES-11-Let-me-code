import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import "../styles/Home.css"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    // const [outcomesDataCategory, setOutcomesDataCategory] = useState(['Food','Transport', 'Entertainment', 'Bills', 'Other']);
    // const [outcomesDataCosts, setOutcomesDataCosts] = useState([1000, 200, 300, 400, 500]);
    // const [outcomesDataDate, setOutcomesDataDate] = useState(['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05']);

    const [transactions, setTransactions] = useState([{'category': 'Bills', 'cost': 100, 'date': '2025-01-01'}, 
        {'category': 'Transport', 'cost': 200, 'date': '2024-01-02'}, 
        {'category': 'Entertainment', 'cost': 300, 'date': '2024-01-03'}, 
        {'category': 'Bills', 'cost': 400, 'date': '2026-01-04'}, 
        {'category': 'A', 'cost': 500, 'date': '2024-02-05'},
        {'category': 'Bs', 'cost': 600, 'date': '2023-01-06'},
        {'category': 'Z', 'cost': 700, 'date': '2024-01-07'},
        {'category': 'X', 'cost': 800, 'date': '2021-01-18'},
        {'category': 'P', 'cost': 900, 'date': '2024-01-09'},
        {'category': 'A', 'cost': 1000, 'date': '2022-01-10'}
    ]);

    // useEffect(() => {
    //     const fetchTransactionsdata = async () => {
    //         try {
    //             const response = await api.get('/transactions');
    //             setTransactions(response.data);
    //         } catch (error) {
    //             console.error('Error fetching transactions data:', error);
    //         }
    //     };
    //     fetchTransactionsdata();
    // }, transactions);

    const possibleColors = [
        'rgba(255, 0, 0, 0.8)',      // Pure Red
        'rgba(0, 0, 255, 0.8)',      // Pure Blue
        'rgba(255, 255, 0, 0.8)',    // Pure Yellow
        'rgba(0, 255, 0, 0.8)',      // Pure Green
        'rgba(255, 0, 255, 0.8)',    // Magenta
        'rgba(0, 255, 255, 0.8)',    // Cyan
        'rgba(255, 128, 0, 0.8)',    // Bright Orange
        'rgba(128, 0, 255, 0.8)',    // Bright Purple
        'rgba(255, 0, 128, 0.8)',    // Hot Pink
        'rgba(0, 255, 128, 0.8)',    // Spring Green
        // ... add more colors if needed
    ];

    function makeBackgroundColors(transactionsSet) {
        const transactionCategories = Array.from(transactionsSet);
        let dictionary = {};
        
        // Assign a color to each unique category
        transactionCategories.forEach((category, index) => {
            dictionary[category] = possibleColors[index];
        });

        return dictionary;
    }
    // Sample data for the pie chart
    const transactionsSet = new Set(transactions.map(transaction => transaction.category));
    const backgroundColors = makeBackgroundColors(transactionsSet);
    const x = transactions.map(transaction => backgroundColors[transaction.category]);
    console.log(x);
    const chartData = {
        labels: [...transactions.map(transaction => transaction.category)],
        datasets: [
            {
                data: [...transactions.map(transaction => transaction.cost)],
                backgroundColor: x,
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial'
                    },
                    color: '#333',
                    padding: 20,
                    usePointStyle: true,
                    generateLabels: function(chart) {
                        const data = chart.data;
                        let uniqueLabels = new Set();
                        let result = [];

                        if (data.labels.length && data.datasets.length) {
                            data.labels.forEach((label, i) => {
                                if (!uniqueLabels.has(label)) {
                                    uniqueLabels.add(label);
                                    result.push({
                                        text: `${label}: $${data.datasets[0].data[i]}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        lineCap: 'round',
                                        lineDash: [],
                                        lineDashOffset: 0,
                                        lineJoin: 'round',
                                        lineWidth: 3,
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        pointStyle: 'circle',
                                        index: i
                                    });
                                }
                            });
                            return result;
                        }
                        return [];
                    }
                }
            },
            title: {
                display: true,
                text: 'Expense Distribution',
                font: {
                    size: 16,
                },
            },
        },
    };

    const printRecentTransactions = () => {
        return [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((transaction, index) => (
            <div key={index}>{index + 1}. Category: {transaction.category}, 
            Cost: {transaction.cost}, 
            Date:  {transaction.date}</div>
        ));
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
                    <div className="dashboard-grid">
                        <div className="chart-container">
                            <h2 className="chart-title">Expense Overview</h2>
                            <div className="chart-wrapper">
                                <Pie data={chartData} options={options} />
                            </div>
                        </div>
                        <div className="transactions-container">
                            <h2 className="transactions-title">Recent Transactions</h2>
                            {printRecentTransactions()}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
