import { useState, useEffect } from "react";
import api from "../api";
import "../styles/pages/Home.css";
import RecentTransactions from "../components/RecentTransactions";
import PieChart from "../components/PieChart";
import Summary from "../components/summary";
import PDF_enter from "../components/PDFEnter";

function Home() {
  const [transactionStats, setTransactionStats] = useState([]);

  const fetchTransactionStats = async () => {
    try {
      const response = await api.get("/api/transaction-stats/");
      if (response.status === 200) {
        setTransactionStats(response.data);
      } else {
        alert("Failed to fetch transaction stats.");
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
    }
  };

  useEffect(() => {
    fetchTransactionStats();
  }, []);

  return (
    <div className="page-container">
      <main className="main-container">
        <div className="dashboard-card">
          <h1 className="text-center">Welcome to Your Dashboard!</h1>
          <h2 className="text-center mt-2">Expense Overview:</h2>
          <PDF_enter />
          <div className="grid">
            <PieChart transactions={transactionStats} />
            <div className="transactions-wrapper">
              <h2 className="text-center">Recent Transactions</h2>
              <RecentTransactions limit={10} />
            </div>
          </div>
        </div>
        <Summary />
      </main>
    </div>
  );
}

export default Home;
