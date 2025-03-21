import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import "../styles/new.css"
import Chart from "../components/Chart";
import RecentTransactions from "../components/RecentTransactions";
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    const [transactions, setTransactions] = useState([{ 'category': 'Food', 'amount': 100, 'date': '2024-01-01' },
    { 'category': 'Transport', 'amount': -200, 'date': '2024-01-02' },
    { 'category': 'Entertainment', 'amount': 300, 'date': '2024-01-03' },
    { 'category': 'Bills', 'amount': 400, 'date': '2024-01-04' },
    { 'category': 'Bills', 'amount': 500, 'date': '2024-01-05' }]);

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


    // Sample data for the pie chart
    const possibleColors = [
        "rgba(28, 28, 72, 1)",   // Muted Midnight Blue
        "rgba(41, 51, 61, 1)",   // Deep Slate Gray
        "rgba(66, 99, 146, 1)",  // Soft Steel Blue
        "rgba(87, 135, 125, 1)", // Gentle Pine Green
        "rgba(124, 165, 115, 1)",// Mossy Green
        "rgba(189, 204, 99, 1)", // Muted Lemon Yellow
        "rgba(224, 206, 149, 1)",// Soft Sand Beige
        "rgba(197, 145, 91, 1)", // Matte Copper
        "rgba(199, 111, 107, 1)",// Earthy Coral
        "rgba(180, 142, 157, 1)",// Dusty Rose
        "rgba(160, 112, 186, 1)",// Subtle Mauve
        "rgba(117, 76, 148, 1)", // Matte Amethyst
        "rgba(77, 62, 102, 1)",  // Smoky Violet
        "rgba(64, 61, 85, 1)",   // Charcoal Purple
        "rgba(41, 41, 56, 1)"    // Ashy Deep Gray
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
                data: [...transactions.map(transaction => transaction.amount)],
                backgroundColor: x,
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        width: 300,  // Add width
        height: 300, // Add height
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
                    generateLabels: function (chart) {
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

    // const printRecentTransactions = () => {
    //     return (
    //         <table className="transactions-table">
    //             <thead>
    //                 <tr>
    //                     <th>#</th>
    //                     <th>Category</th>
    //                     <th>Cost</th>
    //                     <th>Date</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {[...transactions]
    //                     .sort((a, b) => new Date(b.date) - new Date(a.date))
    //                     .map((transaction, index) => (
    //                         <tr key={index}>
    //                             <td>{index + 1}</td>
    //                             <td>{transaction.category}</td>
    //                             <td>${transaction.cost}</td>
    //                             <td>{transaction.date}</td>
    //                         </tr>
    //                     ))}
    //             </tbody>
    //         </table>
    //     );
    // };


    return (
        <div className="fade-in">
            <header className="header">
                <nav className="nav-container">
                    <Link className="nav-links logo">Finance Dashboard</Link>
                        <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/">Transactions</Link></li>
                        <li><Link to="/">Info</Link></li>
                    </ul>
                    <div>
                        <Link className="btn btn-primary" to="/Login">Log in</Link>
                        <Link className="btn btn-primary" to="/Register">Sign Up</Link>
                    </div>
                </nav>
            </header>

            <main className="main-container">
                <div className="card">
                    <h1 className="text-center">Welcome to Your Dashboard!</h1>
                    <h2 className="text-center mt-2">Expense Overview:</h2>        
                    <div className="grid">
                        <div className="card p-2 chart-wrapper">
                            <Pie data={chartData} options={options} />
                        </div>
                        <div className="card p-2 transactions-wrapper">
                            <h2 className="text-center">Recent Transactions</h2>
                            {printRecentTransactions()}
                        </div>    
                    </div>
                </div>
            </main>

            <footer className="header mt-2">
                <div className="nav-container">
                    <p className="text-center footer-txt">©2025 Let me code. All rights reserved</p>
                    <p className="text-center footer-txt">Something</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;

