import { useState, useEffect } from "react";
import api from "../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/new.css"
import Chart from "../components/Chart";
import RecentTransactions from "../components/RecentTransactions";
import Navigation from "../components/Navigation";
import TransactionForm from "../components/TransactionForm";
import IncomeForm from "../components/IncomeForm";
import TransactionList from "../components/TransactionList";
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    const [transactions, setTransactions] = useState([{ 'category': 'Food', 'amount': -100, 'date': '2024-01-01' }]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("business services");
    const [currency, setCurrency] = useState("BGN");
    const [description, setDescription] = useState("");    
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [incomeCurrency, setIncomeCurrency] = useState("BGN");
    
    const [total_budget, setTotalBudget] = useState(0);

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
    const transactionsExpense = transactions.filter(transaction => transaction.amount < 0);
    console.log(x);
    const chartData = {
        labels: [...transactionsExpense.map(transaction => transaction.category)],
        datasets: [
            {
                data: [...transactionsExpense.map(transaction => -transaction.amount)],
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
    
    
    
    
    
    const fetchTransactions = async () => {
        try {
            const response = await api.get("/api/transaction/");
            if (response.status == 200) {
                const data = response.data
                setTransactions(data);
            } else {
                alert("Failed to fetch transactions.");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };
    
    useEffect(() => {
        fetchTransactions();
    }, []);
    
    useEffect(() => {
        const savedIncome = localStorage.getItem('monthlyIncome');
        const savedCurrency = localStorage.getItem('incomeCurrency');
        if (savedIncome) setMonthlyIncome(savedIncome);
        if (savedCurrency) setIncomeCurrency(savedCurrency);
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await api.post("/api/transaction/", {
                amount, 
                category, 
                currency, 
                description
            });
    
            // Axios uses response.status instead of response.ok
            if (response.status === 200 || response.status === 201) {
                alert("Transaction saved successfully!");
                setAmount("");
                setCategory("business services");
                setCurrency("BGN");
                setDescription("");
                fetchTransactions(); // Refresh the list of transactions
            } else {
                alert("Failed to save transaction.");
                console.error("Server error:", response.data);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/api/transaction/${id}/`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json", 
                },
            });
    
            if (response.ok) {
                alert("Transaction deleted successfully!");
                fetchTransactions(); // Refresh the list of transactions
            } else {
                const errorData = response.error;
                alert("Failed to delete transaction.");
                console.error("Server error:", errorData);
            }
        }
        catch (error) {
            //console.error("Error deleting the transaction:", error);
            alert("An error occurred. Please try again.");
        } 
    };      
    
    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        
        const incomeData = {
            amount: parseFloat(monthlyIncome),
            currency: incomeCurrency,
            is_addition: true
        };
    
        try {
            // First, save the income
            const incomeResponse = await api.post("/api/income/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(incomeData),
            });
    
            if (!incomeResponse.ok) {
                throw new Error('Failed to save income');
            }
    
            // Then, update the total budget
            const totalResponse = await api.post("/api/income/total/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: parseFloat(monthlyIncome) }),
            });
    
            if (totalResponse.ok) {
                const data = totalResponse.data;
                setTotalBudget(data.total_budget);
                localStorage.setItem('monthlyIncome', monthlyIncome);
                localStorage.setItem('incomeCurrency', incomeCurrency);
                alert('Income added successfully!');
                await fetchIncome();
            } else {
                throw new Error('Failed to update total budget');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
    const fetchIncome = async () => {
        try {
            const response = await api.get("/api/income/");
            if (response.ok) {
                const data = response.data;
                if (data.length > 0) {
                    const latestIncome = data[0]; // Get most recent income
                    setMonthlyIncome(latestIncome.amount.toString());
                    setIncomeCurrency(latestIncome.currency);
                    localStorage.setItem('monthlyIncome', latestIncome.amount.toString());
                    localStorage.setItem('incomeCurrency', latestIncome.currency);
                }
            }
        } catch (error) {
            console.error("Error fetching income:", error);
        }
    };
    
    // Add this to your useEffect
    useEffect(() => {
        fetchTransactions();
        fetchIncome(); // Add this line
        fetchTotalBudget();
    }, []);
    
    const fetchTotalBudget = async () => {
        try {
            const response = await api.get("/api/income/total");
            if (response.ok) {
                const data = response.data;
                setTotalBudget(data.total_budget);
            }
        } catch (error) {
            console.error("Error fetching total budget:", error);
        }
    };

    return (
        <>
            <div className="fade-in">
                <header className="header">
                <Navigation />
                </header>
                <main className="main-container">
                    <div className="card">
                        <h1 className="text-center">Welcome to Your Dashboard!</h1>
                        <h2 className="text-center mt-2">Expense Overview:</h2>        
                        <div className="grid">
                            <Chart chartData={chartData} options={options} />
                            <div className="card p-2 transactions-wrapper">
                                <h2 className="text-center">Recent Transactions</h2>
                                <RecentTransactions LastTransactions={transactions} />
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
                <div className="form-container">
                    <div className="transaction-form">
                        <TransactionForm 
                            amount={amount}
                            setAmount={setAmount}
                            category={category}
                            setCategory={setCategory}
                            currency={currency}
                            setCurrency={setCurrency}
                            description={description}
                            setDescription={setDescription}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                    <div className="transaction-list">
                        <TransactionList 
                            transactions={transactions}
                            handleDelete={handleDelete}
                        />
                    </div>
                    <div className="income-form">
                        <IncomeForm 
                            monthlyIncome={monthlyIncome}
                            setMonthlyIncome={setMonthlyIncome}
                            incomeCurrency={incomeCurrency}
                            setIncomeCurrency={setIncomeCurrency}
                            handleIncomeSubmit={handleIncomeSubmit}
                            total_budget={total_budget}
                        />
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Home;
