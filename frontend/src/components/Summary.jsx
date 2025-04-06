import api from "../api";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/components/Summary.css";

const fetchSummary = () => {
  return api
    .get("/api/summary/")
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch summary data.");
      }
    })
    .catch((error) => {
      console.error("Error fetching summary:", error);
      throw error;
    });
};

export default function Summary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary()
      .then((data) => setSummary(data))
      .catch((err) => setError(err));
  }, []);

  if (error) return <div>Error loading summary</div>;
  if (!summary) return <div>Loading...</div>;
  if (summary.length === 0)
    return (
      <div className="summary-container">
        <h2 className="summary-title">Insights</h2>
        <div className="summary-empty">
          No insights available yet. Add some transactions to see your financial
          insights!
        </div>
      </div>
    );

  return (
    <div className="summary-container">
      <h2 className="summary-title">Insights</h2>
      <div className="summary-grid">
        {summary.map((insight, index) => {
          return (
            <div key={index} className="summary-item">
              <h3>{insight.title}</h3>
              <ReactMarkdown>{insight.description}</ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
}
