import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './CSS/Login.css';

export default function Login() {
    const { login, loading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [errors, setErrors] = useState([]);

    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        setErrors([]);

        try {
            await login({ email, password });
        } catch (error) {
            const res = error.response?.data;
            if (res?.errors) setErrors(res.errors);
            else setErr(res?.message || 'Login failed');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Login</h2>

                <form onSubmit={submit} className="form">
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <label>Email</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                    </div>

                    {errors.length > 0 && (
                        <ul className="error-list">
                            {errors.map((error, i) => (
                                <li key={i}>{error.msg}</li>
                            ))}
                        </ul>
                    )}

                    {err && <p className="error-text">{err}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="switch-auth">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}
