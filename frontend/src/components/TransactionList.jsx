import "../styles/components/TransactionList.css";

function TransactionList({ transactions, handleDelete }) {
  return (
    <div>
      <h2>All Transactions</h2>
      <ul className="transaction-list">
        {transactions.map((transaction, index) => (
          <li key={index} className="transaction-item">
            <strong>Amount:</strong> {transaction.amount} {transaction.currency}{" "}
            <br />
            <strong>Category:</strong> {transaction.category} <br />
            <strong>Description:</strong> {transaction.particulars || "N/A"}{" "}
            <br />
            <strong>Time:</strong>{" "}
            {new Date(transaction.timestamp).toLocaleString()}
            <button
              className="delete-btn"
              onClick={() => handleDelete(transaction.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;
