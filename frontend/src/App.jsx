import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import VerifyEmail from './pages/VerifyEmail'; // Import VerifyEmail page
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import { AuthContext } from './context/AuthContext';
import Categories from './pages/Categories';
import VerifyEmailNotice from './pages/VerifyEmailNotice';

export default function App() {
  const { user } = useContext(AuthContext);  // Get user from AuthContext

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        {/* Conditionally render Sidebar only if the user is logged in */}
        {user && <Sidebar />}

        {/* Main content */}
        <main style={{ marginLeft: user ? '250px' : '0', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            {/* Update path to '/verify-email' */}
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/transactions' element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/add-transaction" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
            <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
