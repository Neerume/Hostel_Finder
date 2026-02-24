import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const AddHostel = () => {
    const [amenities, setAmenities] = useState(['WiFi', 'AC', 'Laundry']);
    const [newVal, setNewVal] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        rules: '',
        totalRooms: '',
        availableRooms: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addAmenity = (e) => {
        if (e.key === 'Enter' && newVal.trim()) {
            e.preventDefault();
            if (!amenities.includes(newVal.trim())) {
                setAmenities([...amenities, newVal.trim()]);
            }
            setNewVal('');
        }
    };

    const removeAmenity = (item) => {
        setAmenities(amenities.filter(a => a !== item));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting new hostel:", { ...formData, amenities });
        alert("Hostel added successfully! (Placeholder)");
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Add New Hostel</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Fill out the property details below to list it on our platform.</p>
            </div>

            <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                <form onSubmit={handleSubmit}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Hostel Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="E.g. Student Oasis" />
                        </div>

                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required placeholder="Describe your hostel..."></textarea>
                        </div>

                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Full address including city and zip" />
                        </div>

                        <div className="input-group">
                            <label>Contact Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="hostel@example.com" />
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXXXXXXX" />
                        </div>

                        <div className="input-group">
                            <label>Total Rooms</label>
                            <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} required min="1" placeholder="50" />
                        </div>

                        <div className="input-group">
                            <label>Available Rooms</label>
                            <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} required min="0" placeholder="10" />
                        </div>

                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Amenities</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {amenities.map(a => (
                                        <span key={a} style={{
                                            padding: '4px 12px',
                                            background: 'rgba(79, 70, 229, 0.1)',
                                            color: 'var(--primary)',
                                            borderRadius: '16px',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {a}
                                            <button type="button" onClick={() => removeAmenity(a)} style={{ color: 'inherit', fontWeight: 'bold' }}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={newVal}
                                    onChange={(e) => setNewVal(e.target.value)}
                                    onKeyDown={addAmenity}
                                    placeholder="Type an amenity and press Enter"
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Hostel Rules</label>
                            <textarea name="rules" value={formData.rules} onChange={handleChange} rows="2" placeholder="Gate closing time, visitor policy, etc."></textarea>
                        </div>

                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Upload Hostel Image</label>
                            <div style={{
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-8)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                background: 'var(--background)'
                            }}>
                                <UploadCloud size={40} color="var(--text-secondary)" />
                                <p style={{ color: 'var(--text-secondary)' }}>Click to upload or drag and drop</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PNG, JPG, up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-6)' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                            List Property
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddHostel;
