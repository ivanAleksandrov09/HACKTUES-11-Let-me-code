import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
// import "../styles/Home.css"
import "../styles/new.css"

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    const [transactions, setTransactions] = useState([{'category': 'Food', 'cost': 100, 'date': '2024-01-01'}, {'category': 'Transport', 'cost': 200, 'date': '2024-01-02'}, {'category': 'Entertainment', 'cost': 300, 'date': '2024-01-03'}, {'category': 'Bills', 'cost': 400, 'date': '2024-01-04'}, {'category': 'Other', 'cost': 500, 'date': '2024-01-05'}]);

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
    const chartData = {
        labels: [...transactions.map(transaction => transaction.category)],
        datasets: [
            {
                data: [...transactions.map(transaction => transaction.cost)],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
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
        return transactions.map((transaction, index) => (
            <div key={index}>{index + 1}. Category: {transaction.category}, Cost: {transaction.cost}, Date:  {transaction.date}</div>
        ));
    };


    return (
        <div className="fade-in">
            <header className="header">
                <nav className="nav-container">
                    <Link className="nav-links logo" to="/">Logo</Link>
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
