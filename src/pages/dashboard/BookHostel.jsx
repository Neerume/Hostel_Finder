import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, Info, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BookHostel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        booking_type: 'visit',
        booking_date: '',
    });

    useEffect(() => {
        const fetchHostel = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/hostels/${id}`);
                setHostel(res.data.data.hostel);
            } catch (error) {
                console.error("Failed to fetch hostel details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHostel();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/v1/bookings/request',
                {
                    hostel_id: id,
                    ...formData
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Booking request sent successfully!');
            navigate('/user/dashboard'); // Or to a 'my bookings' page
        } catch (error) {
            console.error("Booking failed:", error);
            alert(error.response?.data?.message || 'Failed to send booking request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading hostel details...</div>;
    if (!hostel) return <div style={{ padding: '40px', textAlign: 'center' }}>Hostel not found.</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} /> Back to Details
            </button>

            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Request Booking</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Complete the form below to book a visit or a room at <strong>{hostel.name}</strong>.</p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Booking Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div
                                onClick={() => setFormData({ ...formData, booking_type: 'visit' })}
                                style={{
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${formData.booking_type === 'visit' ? 'var(--primary)' : 'var(--border)'}`,
                                    background: formData.booking_type === 'visit' ? 'rgba(79, 70, 229, 0.05)' : 'white',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Clock size={24} style={{ marginBottom: '8px', color: formData.booking_type === 'visit' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                                <div style={{ fontWeight: '600' }}>Book a Visit</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Schedule an appointment</div>
                            </div>
                            <div
                                onClick={() => setFormData({ ...formData, booking_type: 'room' })}
                                style={{
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${formData.booking_type === 'room' ? 'var(--primary)' : 'var(--border)'}`,
                                    background: formData.booking_type === 'room' ? 'rgba(79, 70, 229, 0.05)' : 'white',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Calendar size={24} style={{ marginBottom: '8px', color: formData.booking_type === 'room' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                                <div style={{ fontWeight: '600' }}>Book a Room</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Request to move in</div>
                            </div>
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Requested Date</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.booking_date}
                            onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '32px', display: 'flex', gap: '12px' }}>
                        <Info size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
                        <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                            Your request will be sent to the owner for approval. You will receive an update once they process your booking.
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary w-full"
                        style={{ padding: '14px', fontSize: '1rem', gap: '10px' }}
                    >
                        {submitting ? 'Sending Request...' : 'Confirm Request'}
                        {!submitting && <CheckCircle size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookHostel;
