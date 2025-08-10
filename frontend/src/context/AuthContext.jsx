import React, { createContext, useState, useEffect } from "react";
import API from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // { _id, name, email }
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            setUser(JSON.parse(userStr));
        }
        setLoading(false);
    }, []);

    // ✅ Updated: Do not log in user immediately after registration
    const register = async ({ name, email, password }) => {
        setLoading(true);
        try {
            await API.post('/auth/register', { name, email, password });

            // ✅ Redirect to verification info page
            navigate('/verify-email-notice');
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ✅ This will only succeed if user is verified
    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const { data } = await API.post('/auth/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
            setUser({ _id: data._id, name: data.name, email: data.email });

            navigate('/dashboard');
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
