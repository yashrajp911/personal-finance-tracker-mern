import React, { useState, useEffect } from 'react';
import './CSS/Transactions.css';  // Ensure this file is created for styles
import API from '../api';  // Assuming API is your Axios instance or fetch helper

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingTransaction, setEditingTransaction] = useState(null); // For Edit functionality
    const [startDate, setStartDate] = useState('');  // State for start date
    const [endDate, setEndDate] = useState('');    // State for end date
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Fetch all transactions
    const fetchTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch transactions');
            }
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    // Filter transactions by type, search query, and date range
    const filteredTransactions = transactions
        .filter((t) =>
            (filterType === 'all' ||
                t.type === filterType) &&
            (t.category.toLowerCase().includes(search.toLowerCase()) ||
                t.description?.toLowerCase().includes(search.toLowerCase())) &&
            // Date filter logic
            (!startDate || new Date(t.date) >= new Date(startDate)) &&
            (!endDate || new Date(t.date) <= new Date(endDate))
        );

    // Handle delete transaction
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete transaction');
            }

            // Remove transaction from the state
            setTransactions(transactions.filter((t) => t._id !== id));
            alert('Transaction deleted successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle edit transaction
    const handleEdit = async (transaction) => {
        setEditingTransaction(transaction);
    };

    // Handle save edited transaction
    const handleSaveEdit = async (updatedTransaction) => {
        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${updatedTransaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update transaction');
            }

            // Update the transaction in the state
            setTransactions(
                transactions.map((t) =>
                    t._id === updatedTransaction._id ? updatedTransaction : t
                )
            );
            setEditingTransaction(null); // Close the edit form
            alert('Transaction updated successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="transactions-wrapper">
            <h1>Your Transactions</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by category or description"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                {/* Date Filters */}
                <div className="date-filters">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="start-date"
                    />
                    <span> to </span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="end-date"
                    />
                </div>
            </div>

            {loading && <p>Loading transactions...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!loading && !error && filteredTransactions.length === 0 && (
                <p>No transactions found.</p>
            )}

            {!loading && !error && filteredTransactions.length > 0 && (
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t) => (
                            <tr key={t._id} className={t.type === 'income' ? 'income' : 'expense'}>
                                <td>{new Date(t.date).toLocaleDateString()}</td>
                                <td>{t.type === 'income' ? 'Income' : 'Expense'}</td>
                                <td>{t.category}</td>
                                <td>{t.description || '-'}</td>
                                <td>${t.amount.toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="action-btn edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id)}
                                        className="action-btn delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Edit Transaction Modal */}
            {editingTransaction && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Transaction</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit(editingTransaction);
                            }}
                        >
                            <div>
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={editingTransaction.amount}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, amount: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={editingTransaction.category}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, category: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={editingTransaction.description || ''}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, description: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label>Type</label>
                                <select
                                    value={editingTransaction.type}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, type: e.target.value })
                                    }
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={editingTransaction.date}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, date: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingTransaction(null)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
