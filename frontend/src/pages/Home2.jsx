import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";

function Home() {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("business services");
    const [currency, setCurrency] = useState("BGN");
    const [description, setDescription] = useState("");
    const [transactions, setTransactions] = useState([]);

    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [incomeCurrency, setIncomeCurrency] = useState("BGN");

    const [total_budget, setTotalBudget] = useState(0);




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
            const incomeResponse = await api.post("/api/income/", incomeData);
    
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
        <div className="form-container">
            <h1>Transaction Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="business services">Business Services</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="groceries">Groceries</option>
                    <option value="eating out">Eating Out</option>
                    <option value="bills">Bills</option>
                    <option value="transport">Transport</option>
                    <option value="health">Health</option>
                    <option value="travel">Travel</option>
                    <option value="finance">Finance</option>
                    <option value="general">General</option>
                </select>

                <label htmlFor="currency">Currency</label>
                <select
                    id="currency"
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                >
                    <option value="BGN">BGN</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <button type="submit">Submit</button>
            </form>
            <h2>All Transactions</h2>
            <ul className="transaction-list">
                {transactions.map((transaction, index) => (
                    <li key={index} className="transaction-item">
                        <strong>Amount:</strong> {transaction.amount} {transaction.currency} <br />
                        <strong>Category:</strong> {transaction.category} <br />
                        <strong>Description:</strong> {transaction.description || "N/A"} <br />
                        <strong>Time:</strong> {new Date(transaction.time).toLocaleString()}
                        <button 
                            className="delete-btn"
                            onClick={() => handleDelete(transaction.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div className="income-section">
                <h2>Add to Budget</h2>
                <form onSubmit={handleIncomeSubmit}>
                    <div className="form-group">
                        <label htmlFor="monthlyIncome">Amount:</label>
                        <input
                            type="number"
                            id="monthlyIncome"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="incomeCurrency">Currency:</label>
                        <select
                            id="incomeCurrency"
                            value={incomeCurrency}
                            onChange={(e) => setIncomeCurrency(e.target.value)}
                        >
                            <option value="BGN">BGN</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">
                        Update Budget
                    </button>
                </form>
                <div className="total-display">
                    <h3>Total Budget: {total_budget} BGN</h3>
                </div>
            </div>

        <h2>All Transactions</h2>
        {/* ...existing transactions list... */}
    </div>
);
}


export default Home;