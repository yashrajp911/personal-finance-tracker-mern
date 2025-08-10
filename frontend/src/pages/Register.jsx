import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './CSS/Register.css';

export default function Register() {
    const { register, loading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [errors, setErrors] = useState([]);

    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        setErrors([]);

        try {
            await register({ name, email, password });
        } catch (error) {
            const res = error.response?.data;
            if (res?.errors) setErrors(res.errors);
            else setErr(res?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <h2>Create an Account</h2>

                <form onSubmit={submit} className="form">
                    <div className="form-group">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <label>Name</label>
                    </div>

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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="switch-auth">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </div>
        </div>
    );
}
