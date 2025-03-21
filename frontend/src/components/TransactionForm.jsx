import React from 'react';

function TransactionForm({ 
    amount, 
    setAmount, 
    category, 
    setCategory, 
    currency, 
    setCurrency, 
    description, 
    setDescription, 
    handleSubmit 
}) {
    return (
        <div>
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
        </div>
    );
}

export default TransactionForm; 