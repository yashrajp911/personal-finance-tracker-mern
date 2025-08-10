import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState('Verifying...');
    const [error, setError] = useState(null);

    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setError('No verification token found.');
                return;
            }

            try {
                const res = await fetch(`http://127.0.0.1:5000/api/auth/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus(data.message || 'Email verified successfully!');
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    setError(data.message || 'Verification failed.');
                }
            } catch (err) {
                setError('Something went wrong. Please try again.');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Email Verification</h2>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>{status}</p>
                    {status.includes('success') && <p>Redirecting to login...</p>}
                </>
            )}
        </div>
    );
};

export default VerifyEmail;
