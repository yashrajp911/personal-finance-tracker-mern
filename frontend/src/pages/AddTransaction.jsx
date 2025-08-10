import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CSS/AddTransaction.css';
import API from '../api';

export default function AddTransaction() {
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('income'); // default type to 'income'
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories'); // Endpoint to fetch categories
                setCategories(response.data); // Store categories in state
            } catch (err) {
                console.error("Error fetching categories", err);
                setError("Failed to load categories");
            }
        };

        fetchCategories();
    }, []); // Empty dependency array means this will run once when the component mounts

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the input fields
        if (!amount || !category || !date) {
            setError("Please fill all fields");
            return;
        }

        try {
            const newTransaction = {
                amount,
                category,
                description,
                type,
                date,
            };

            const token = localStorage.getItem('token');
            const response = await API.post('/transactions', newTransaction, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset the form fields after successful submission
            setAmount('');
            setCategory('');
            setDescription('');
            setType('income');
            setDate('');
            console.log('Transaction Added:', response.data);
        } catch (err) {
            console.error("Error adding transaction:", err);
            setError('There was an error adding the transaction.');
        }
    };

    return (
        <div className="transaction-wrapper">
            <div className="transaction-form-card">
                <h2>Add a Transaction</h2>
                <form onSubmit={handleSubmit} className="transaction-form">
                    {error && <p className="error-text">{error}</p>}

                    <div className="form-group1">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder='Enter Amount'
                        />
                    </div>

                    <div className="form-group2">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group3">
                        <label>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description (optional)"
                        />
                    </div>

                    <div className="form-group4">
                        <label>Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="form-group5">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">Add Transaction</button>
                </form>
            </div>
        </div>
    );
}
