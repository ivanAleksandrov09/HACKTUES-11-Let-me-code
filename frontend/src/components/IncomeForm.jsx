function IncomeForm({ monthlyIncome, setMonthlyIncome, incomeCurrency, setIncomeCurrency, handleIncomeSubmit, total_budget }) {
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
                <h3>Total Budget: {total_budget} BGN</h3>
            </div>
        </div>
    );
}

export default IncomeForm; 