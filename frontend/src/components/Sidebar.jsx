import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CSS/Sidebar.css'

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation(); // For active link detection

    return (
        <div className="sidebar">
            <div className="sidebar-title">
                Welcome, {user?.name}
            </div>
            <ul className="sidebar-nav">
                <li>
                    <Link
                        to="/dashboard"
                        className={location.pathname === "/dashboard" ? "active-link" : ""}
                    >
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        to="/transactions"
                        className={location.pathname === "/transactions" ? "active-link" : ""}
                    >
                        Transactions
                    </Link>
                </li>
                <li>
                    <Link
                        to="/add-transaction"
                        className={location.pathname === "/add-transaction" ? "active-link" : ""}
                    >
                        Add Transaction
                    </Link>
                </li>
                <li>
                    <Link
                        to="/categories"
                        className={location.pathname === "/categories" ? "active-link" : ""}
                    >
                        Categories
                    </Link>
                </li>
            </ul>
        </div>
    );
}
