import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/new.css";
import RecentTransactions from "../components/RecentTransactions";
import Navigation from "../components/Navigation";
import TransactionForm from "../components/TransactionForm";
import IncomeForm from "../components/IncomeForm";
import TransactionList from "../components/TransactionList";
import PieChart from "../components/PieChart";

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/api/transactions/");
      if (response.status === 200) {
        setTransactions(response.data);
      } else {
        alert("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const response = await api.get("/api/transaction-stats/");
      if (response.status === 200) {
        setTransactionStats(response.data);
        console.log("Transaction stats:", response.data);
      } else {
        alert("Failed to fetch transaction stats.");
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/api/transaction/${id}/`);
      if (response.status === 200) {
        alert("Transaction deleted successfully!");
        fetchTransactions();
      } else {
        alert("Failed to delete transaction.");
        console.error("Server error:", response.data);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
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
              <PieChart transactions={transactionStats} />
              <div className="card p-2 transactions-wrapper">
                <h2 className="text-center">Recent Transactions</h2>
                <RecentTransactions LastTransactions={transactions} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="form-container">
        <TransactionForm onTransactionAdded={fetchTransactions} />
        <TransactionList
          transactions={transactions}
          handleDelete={handleDelete}
        />
        <IncomeForm />
      </div>
      <footer className="header mt-2">
        <div className="nav-container">
          <p className="text-center footer-txt">
            ©2025 Let me code. All rights reserved
          </p>
          <p className="text-center footer-txt">Something</p>
        </div>
      </footer>
    </>
  );
}

export default Home;