import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const EditProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                const { fullname, email } = res.data.data.profile;
                setFormData(prev => ({ ...prev, fullname, email }));
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setMessage({ type: 'error', text: 'Failed to load profile details.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updateData = {
                fullname: formData.fullname,
                email: formData.email
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const res = await api.patch('/auth/profile', updateData);

            // Update local context
            updateUser({
                fullname: res.data.data.profile.fullname,
                email: res.data.data.profile.email
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err) {
            console.error("Failed to update profile:", err);
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Edit Profile</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details and security settings.</p>
            </div>

            {message.text && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-6)',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? 'var(--secondary)' : '#ef4444',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    fontSize: '0.9rem'
                }}>
                    {message.text}
                </div>
            )}

            <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                <form onSubmit={handleSubmit}>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)', marginTop: 0 }}>Personal Information</h3>

                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
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
                                placeholder="Email Address"
                                style={{ paddingLeft: '36px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--spacing-6) 0' }} />

                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>Security</h3>

                    {/* In a production app you'd want current password to verify identity */}
                    {/* <div className="input-group">
                        <label>Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="••••••••"
                                style={{ paddingLeft: '36px' }}
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div> */}

                    <div className="input-group">
                        <label>New Password (Leave blank to keep current)</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                style={{ paddingLeft: '36px' }}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-6)' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;
