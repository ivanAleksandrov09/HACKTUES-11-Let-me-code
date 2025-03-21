import { useState, useEffect } from 'react';
import api from '../api';

function IncomeForm() {
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [incomeCurrency, setIncomeCurrency] = useState("BGN");
    const [totalBudget, setTotalBudget] = useState(0);

    useEffect(() => {
        const savedIncome = localStorage.getItem('monthlyIncome');
        const savedCurrency = localStorage.getItem('incomeCurrency');
        if (savedIncome) setMonthlyIncome(savedIncome);
        if (savedCurrency) setIncomeCurrency(savedCurrency);
        fetchIncome();
        fetchTotalBudget();
    }, []);

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();

        const incomeData = {
            amount: parseFloat(monthlyIncome),
            currency: incomeCurrency,
            is_addition: true
        };

        try {
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
                    const latestIncome = data[0];
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
                <h3>Total Budget: {totalBudget} BGN</h3>
            </div>
        </div>
    );
}

export default IncomeForm;