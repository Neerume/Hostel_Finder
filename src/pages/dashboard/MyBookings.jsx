import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, Building2, MapPin, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const isOwner = user?.role === 'owner';

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/v1/bookings/my-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data.data.bookings);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this booking?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/v1/bookings/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Booking ${status} successfully.`);
            fetchBookings();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update booking status.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading bookings...</div>;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    {isOwner ? 'Manage Booking Requests' : 'My Booking Requests'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {isOwner
                        ? 'Review and approve requests from students looking for visits or rooms.'
                        : 'Track the status of your room and visit requests.'}
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Calendar size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No bookings found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {bookings.map(booking => (
                        <div key={booking.booking_id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    background: booking.booking_type === 'room' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: booking.booking_type === 'room' ? 'var(--primary)' : 'var(--secondary)'
                                }}>
                                    {booking.booking_type === 'room' ? <Building2 size={30} /> : <Clock size={30} />}
                                </div>

                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                                        {isOwner ? `Request from ${booking.user_name}` : booking.hostel_name}
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} /> Requested for: <strong>{new Date(booking.booking_date).toLocaleDateString()}</strong>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Info size={14} /> Type: <span style={{ textTransform: 'capitalize' }}>{booking.booking_type}</span>
                                        </div>
                                        {isOwner && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} /> Contact: {booking.user_email}
                                            </div>
                                        )}
                                        {!isOwner && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} /> {booking.hostel_address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize',
                                        background:
                                            booking.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                                booking.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color:
                                            booking.status === 'pending' ? '#d97706' :
                                                booking.status === 'approved' ? 'var(--secondary)' : '#ef4444'
                                    }}>
                                        {booking.status}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        Requested on {new Date(booking.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {isOwner && booking.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleUpdateStatus(booking.booking_id, 'approved')}
                                            style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', transition: 'all 0.2s', border: '1px solid transparent' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; e.currentTarget.style.color = 'var(--secondary)'; }}
                                            title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(booking.booking_id, 'rejected')}
                                            style={{ padding: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', transition: 'all 0.2s', border: '1px solid transparent' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            title="Reject"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
