import "./RecentTransactions.css";
export default function RecentTransactions({ LastTransactions }) {

    return (
        <table className="transactions-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Amount($)</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {[...LastTransactions]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((transaction, index) => (
                        <tr key={index} className={transaction.amount > 0 ? "income" : "expense"}>
                            <td>{index + 1}</td>
                            <td>{transaction.category}</td>
                            <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}</td>
                            <td>{transaction.date}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );

}
