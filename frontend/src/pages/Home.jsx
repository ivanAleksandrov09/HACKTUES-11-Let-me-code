import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import "../styles/Home.css"

function Home() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    return (
        <body>
            {/*navbar*/}
            <div class="navbar">
                <Link class="name" to="/">Logo</Link>
                <ul class="ul_navbar">
                    <li><div class="item item-1"><Link to="/">Home</Link></div></li>
                    <li><div class="item item-2"><Link to="/">Transatctions</Link></div></li>
                    <li><div class="item item-3"><Link to="/">Info</Link></div></li>
                </ul>
                <div class="something_container">
                <Link class="something Login" to="/Login">Log in</Link>
                <Link class="something Signup" to="/Register">Sign Up</Link>
                </div>
            </div>
            {/*End of navbar*/}
            {/*footer*/}
            <div class="footer">
                <p class="text text1">&#169;2025 Let me code.<br></br>All rigths reserved </p>

                <p class="something something2">Something</p>
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
        </body>
    );
}

export default Home;
