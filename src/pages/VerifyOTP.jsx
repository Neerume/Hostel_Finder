import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const VerifyOTP = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email') || 'your email';
    const type = searchParams.get('type') || 'user';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one character per box
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if filled
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            await api.post('/auth/verify-otp', { email, otp: otpValue });
            // Redirect to login after successful verification
            navigate(`/login/${type}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: 'var(--spacing-4)' }}>
                    <CheckCircle2 size={48} />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Verify Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-6)' }}>
                    Enter the 6-digit OTP sent to <br /><strong>{email}</strong>
                </p>

                {error && <div style={{ color: '#ef4444', marginBottom: 'var(--spacing-4)', textAlign: 'center', fontSize: '0.875rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleVerify}>
                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="otp-box"
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                required
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4" style={{ padding: '12px' }}>
                        Verify Email
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-6)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Didn't receive code? </span>
                    <button style={{ color: 'var(--primary)', fontWeight: 600, padding: 0 }}>
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
