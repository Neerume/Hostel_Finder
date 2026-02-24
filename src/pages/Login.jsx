import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { type } = useParams(); // 'user' or 'owner'
    const navigate = useNavigate();
    const { loginUser, loginOwner } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isOwner = type === 'owner';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isOwner) {
                await loginOwner(email, password);
                navigate('/owner/dashboard');
            } else {
                await loginUser(email, password);
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <h2 style={{ marginTop: 'var(--spacing-4)', fontSize: '1.5rem', textAlign: 'center' }}>
                        {isOwner ? 'Owner Login' : 'User Login'}
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--spacing-1)' }}>
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {error && <div style={{ color: '#ef4444', marginBottom: 'var(--spacing-4)', textAlign: 'center', fontSize: '0.875rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}

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

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{ paddingLeft: '36px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-6)' }}>
                        <Link to={`/forgot-password?type=${type}`} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ padding: '12px' }}>
                        <LogIn size={18} />
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
                    <Link to={`/register/${type}`} style={{ fontWeight: 600 }}>
                        Register as {isOwner ? 'Owner' : 'User'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
