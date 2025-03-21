import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import "../styles/Home.css"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    const [transactions, setTransactions] = useState([{'category': 'Food', 'cost': 100, 'date': '2024-01-01'}, 
        {'category': 'Transport', 'cost': 200, 'date': '2024-01-02'}, 
        {'category': 'Entertainment', 'cost': 300, 'date': '2024-01-03'}, 
        {'category': 'Bills', 'cost': 400, 'date': '2024-01-04'}, 
        {'category': 'Bills', 'cost': 500, 'date': '2024-01-05'}]);

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
                    "rgba(28, 28, 72, 0.8)",   // Muted Midnight Blue
                    "rgba(41, 51, 61, 0.8)",   // Deep Slate Gray
                    "rgba(66, 99, 146, 0.8)",  // Soft Steel Blue
                    "rgba(87, 135, 125, 0.8)", // Gentle Pine Green
                    "rgba(124, 165, 115, 0.8)",// Mossy Green
                    "rgba(189, 204, 99, 0.8)", // Muted Lemon Yellow
                    "rgba(224, 206, 149, 0.8)",// Soft Sand Beige
                    "rgba(197, 145, 91, 0.8)", // Matte Copper
                    "rgba(199, 111, 107, 0.8)",// Earthy Coral
                    "rgba(180, 142, 157, 0.8)",// Dusty Rose
                    "rgba(160, 112, 186, 0.8)",// Subtle Mauve
                ],
                borderColor: [
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
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
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
        <>
            {/*navbar*/}
            <div className="navbar">
                <Link className="name" to="/">Logo</Link>
                <ul className="ul_navbar">
                    <li><div className="item item-1"><Link to="/">Home</Link></div></li>
                    <li><div className="item item-2"><Link to="/">Transatctions</Link></div></li>
                    <li><div className="item item-3"><Link to="/">Info</Link></div></li>
                </ul>
                <div className="something_container">
                <Link className="something Login" to="/Login">Log in</Link>
                <Link className="something Signup" to="/Register">Sign Up</Link>
                </div>
            </div>
            {/*End of navbar*/}
            {/*footer*/}
            <div className="footer">
                <p classNameName="text text1">&#169;2025 Let me code.<br></br>All rigths reserved </p>

                <p className="something something2">Something</p>
            </div> 


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
        </>
    );
}

export default Home;
