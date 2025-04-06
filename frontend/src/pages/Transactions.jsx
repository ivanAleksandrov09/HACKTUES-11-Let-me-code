import { useState, useEffect } from "react";
import api from "../api";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import "../styles/pages/Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/api/transactions/", {
        params: { ordering: "-timestamp" },
      });
      if (response.status === 200) {
        setTransactions(response.data);
      } else {
        alert("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/api/transaction/${id}/`);
      if (response.status === 204) {
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <aside className="form-sidebar">
          <TransactionForm onTransactionAdded={fetchTransactions} />
        </aside>
        <main className="transactions-main">
          <div className="transactions-content">
            <TransactionList
              transactions={transactions}
              handleDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
