import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import './CSS/Dashboard.css';

// 👉 Chart.js setup
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [transactionsRes, summaryRes] = await Promise.all([
                    API.get('/transactions'),
                    API.get('/transactions/summary/monthly'),
                ]);
                setTransactions(transactionsRes.data);
                setMonthlySummary(summaryRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Totals
    const income = transactions
        .filter(tx => tx.type === 'income')
        .reduce((acc, tx) => acc + tx.amount, 0);
    const expense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => acc + tx.amount, 0);
    const balance = income - expense;

    // 👉 Prepare category breakdown (expense only)
    const expenseByCategory = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});

    const pieData = {
        labels: Object.keys(expenseByCategory),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(expenseByCategory),
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4caf50',
                    '#ba68c8',
                    '#f44336',
                    '#2196f3',
                    '#ff9800',
                    '#9ccc65',
                    '#26a69a',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard-wrapper">
            <h2>Welcome back, {user?.name}</h2>

            <div className="summary-cards">
                <div className="card income-card">
                    <h4>Income</h4>
                    <p>${income.toFixed(2)}</p>
                </div>
                <div className="card expense-card">
                    <h4>Expense</h4>
                    <p>${expense.toFixed(2)}</p>
                </div>
                <div className="card balance-card">
                    <h4>Balance</h4>
                    <p>${balance.toFixed(2)}</p>
                </div>
            </div>

            <section className="monthly-summary">
                <h3>Monthly Summary</h3>
                {monthlySummary.length === 0 ? (
                    <p>No monthly summary data available.</p>
                ) : (
                    monthlySummary.map(({ year, month, income, expense, netSavings }) => {
                        const monthName = new Date(year, month - 1).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                        });

                        return (
                            <div key={`${year}-${month}`} className="monthly-summary-card">
                                <h4>{monthName}</h4>
                                <p>Income: ${income.toFixed(2)}</p>
                                <p>Expense: ${expense.toFixed(2)}</p>
                                <p>Net: ${netSavings.toFixed(2)}</p>
                            </div>
                        );
                    })
                )}
            </section>

            {/* ✅ New Section: Category Breakdown Chart */}
            <section className="category-breakdown">
                <h3>Expense Breakdown by Category</h3>
                {Object.keys(expenseByCategory).length === 0 ? (
                    <p>No expense data to display.</p>
                ) : (
                    <div className="pie-chart-wrapper">
                        <Pie data={pieData} />
                    </div>
                )}
            </section>

            <section className="transaction-section">
                <h3>Transaction History</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : transactions.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx._id}>
                                    <td className={tx.type}>{tx.type}</td>
                                    <td>${tx.amount}</td>
                                    <td>{tx.category}</td>
                                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
