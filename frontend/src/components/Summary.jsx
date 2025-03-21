import api from "../api";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

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

  return (
    <div>
      <h2>Insights</h2>
      {summary.map((insight, index) => {
        return (
          <div key={index} className="summary-item">
            <h3>{insight.title}</h3>
            <ReactMarkdown>{insight.description}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
