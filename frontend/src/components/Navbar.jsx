import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './CSS/Navbar.css';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">💰 Finance Tracker</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-user">Hi, {user.name}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
