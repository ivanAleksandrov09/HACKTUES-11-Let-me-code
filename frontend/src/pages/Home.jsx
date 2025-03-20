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

    function makeBackgroundColors(transactions) {
        const colors = [];
        const transactionCategories = [];
        
        for (let i = 0; i < transactions.length; i++) {
            if(transactionCategories.includes(transactions[i].category)) {
                colors.push(colors[transactionCategories.indexOf(transactions[i].category)]);
            } else {
                transactionCategories.push(transactions[i].category);
                const color = `rgba(${Math.floor(Math.random() * 255)}, 
                    ${Math.floor(Math.random() * 255)}, 
                    ${Math.floor(Math.random() * 255)}, 0.8)`;
                if(colors.includes(color)) {
                    i--;
                } else {
                    colors.push(color);
                }
            }
        }
        return colors;
    }
    // Sample data for the pie chart
    const backgroundColors = makeBackgroundColors(transactions);
    alert(backgroundColors);
    const chartData = {
        labels: [...transactions.map(transaction => transaction.category)],
        datasets: [
            {
                data: [...transactions.map(transaction => transaction.cost)],
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8)', '1)')),
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
