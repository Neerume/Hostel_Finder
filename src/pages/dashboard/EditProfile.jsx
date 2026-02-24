import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        fullname: 'John Doe',
        email: 'john@example.com',
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Saving profile:", formData);
        alert("Profile changes saved successfully! (Placeholder)");
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Edit Profile</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details and security settings.</p>
            </div>

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

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--spacing-6) 0' }} />

                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>Change Password</h3>

                    <div className="input-group">
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
                    </div>

                    <div className="input-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="••••••••"
                                style={{ paddingLeft: '36px' }}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-6)' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;
