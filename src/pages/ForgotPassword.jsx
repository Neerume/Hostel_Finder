import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import api from '../utils/api';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'user';

    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '400px' }}>
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <Link to={`/login/${type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>

                    <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>
                        <KeyRound size={48} />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                        Forgot Password
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--spacing-2)' }}>
                        {isSent
                            ? 'Check your email for a code to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'
                            : 'Enter your email address to receive a temporary password.'}
                    </p>
                </div>

                {error && <div style={{ color: '#ef4444', marginBottom: 'var(--spacing-4)', textAlign: 'center', fontSize: '0.875rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}

                {!isSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{ paddingLeft: '36px' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4" style={{ padding: '12px' }}>
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <button
                        type="button"
                        className="btn btn-outline w-full"
                        style={{ padding: '12px' }}
                        onClick={() => setIsSent(false)}
                    >
                        Try another email
                    </button>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
