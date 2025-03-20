import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import "../styles/Home.css"

function Home() {
    const [transactions, setTransactions] = useState([{'category': 'Food', 'cost': 100, 'date': '2024-01-01'}, 
        {'category': 'Transport', 'cost': 200, 'date': '2024-01-02'}, 
        {'category': 'Entertainment', 'cost': 300, 'date': '2024-01-03'}, 
        {'category': 'Bills', 'cost': 400, 'date': '2024-01-04'}, 
        {'category': 'Other', 'cost': 500, 'date': '2024-01-05'}]);

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
