import React, { useState, useEffect } from 'react';
import { Home, Users, CheckCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HostelCard from '../../components/HostelCard';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [stats, setStats] = useState({
        totalHostels: 0,
        availableRooms: 0,
        activeBookings: 28, // Placeholder
        monthlyRevenue: '₹1.2L' // Placeholder
    });

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/v1/hostels/my-hostels', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const fetchedHostels = res.data.data.hostels;
                setHostels(fetchedHostels);

                let availableRooms = 0;
                fetchedHostels.forEach(h => {
                    availableRooms += (h.available_rooms || 0);
                });

                setStats(prev => ({
                    ...prev,
                    totalHostels: fetchedHostels.length,
                    availableRooms
                }));
            } catch (error) {
                console.error("Failed to fetch hostels:", error);
            }
        };

        fetchHostels();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/owner/hostel/${id}`);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-6)' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Overview Dashboard</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here is what's happening today.</p>
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => navigate('/owner/bookings')}
                    style={{ gap: '8px' }}
                >
                    <Users size={18} /> Manage Bookings
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                        <Home size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Hostels</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stats.totalHostels}</h3>
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: '50%' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Available Rooms</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stats.availableRooms}</h3>
                    </div>
                </div>

                <div
                    className="card card-hover"
                    onClick={() => navigate('/owner/bookings')}
                    style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', cursor: 'pointer' }}
                >
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Active Bookings</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stats.activeBookings}</h3>
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Monthly Revenue</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stats.monthlyRevenue}</h3>
                    </div>
                </div>

            </div>

            {/* Hostels List */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>My Properties</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                {hostels.length === 0 ? (
                    <p>No hostels found. Add one to get started!</p>
                ) : (
                    hostels.map(hostel => (
                        <HostelCard
                            key={hostel.hostel_id}
                            hostel={{
                                ...hostel,
                                id: hostel.hostel_id,
                                location: hostel.address,
                                image: (() => {
                                    // hostel_image_url is a JSON array of relative paths
                                    const urls = hostel.hostel_image_url;
                                    const first = Array.isArray(urls) && urls.length > 0
                                        ? urls[0]
                                        : (typeof urls === 'string' && urls ? urls : null);
                                    if (!first) return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop';
                                    // If it's already a full URL, use it directly
                                    return first.startsWith('http') ? first : `http://localhost:5000${first}`;
                                })(),
                                totalRooms: hostel.number_of_rooms,
                                availableRooms: hostel.available_rooms,
                                price: hostel.price || 0
                            }}
                            isOwner={true}
                            onViewDetails={handleViewDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
