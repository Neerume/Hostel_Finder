import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
    const { type } = useParams(); // 'user' or 'owner'
    const navigate = useNavigate();
    const isOwner = type === 'owner';

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        hostelName: isOwner ? '' : undefined,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        // Dummy submit
        console.log(`Registering ${type}:`, formData);
        // Redirect to OTP
        navigate(`/verify-otp?type=${type}&email=${formData.email}`);
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '450px' }}>
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <Link to={`/login/${type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                    <h2 style={{ marginTop: 'var(--spacing-4)', fontSize: '1.5rem', textAlign: 'center' }}>
                        Register as {isOwner ? 'Owner' : 'User'}
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--spacing-1)' }}>
                        Create your account to get started.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                style={{ paddingLeft: '36px' }}
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                style={{ paddingLeft: '36px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {isOwner && (
                        <div className="input-group">
                            <label>Hostel Name</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                    <Building size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="hostelName"
                                    placeholder="Sunny Student Hostel"
                                    style={{ paddingLeft: '36px' }}
                                    value={formData.hostelName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                style={{ paddingLeft: '36px' }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                style={{ paddingLeft: '36px' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4" style={{ padding: '12px' }}>
                        Register Account
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                    <Link to={`/login/${type}`} style={{ fontWeight: 600 }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
