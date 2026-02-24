import React from 'react';
import { Home, Users, CheckCircle, TrendingUp } from 'lucide-react';
import HostelCard from '../../components/HostelCard';

const DUMMY_OWNER_HOSTELS = [
    {
        id: 101,
        name: 'My Hostel A',
        location: 'Sector 5, Downtown',
        description: 'Fully furnished, AC rooms for students.',
        price: 9000,
        availableRooms: 2,
        totalRooms: 30,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'
    }
];

const OwnerDashboard = () => {
    const handleViewDetails = (id) => {
        alert(`View details for hostel ID: ${id}`);
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Overview Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here is what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                        <Home size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Hostels</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>1</h3>
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: '50%' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Available Rooms</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>2</h3>
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Active Bookings</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>28</h3>
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Monthly Revenue</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>₹1.2L</h3>
                    </div>
                </div>

            </div>

            {/* Hostels List */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>My Properties</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                {DUMMY_OWNER_HOSTELS.map(hostel => (
                    <HostelCard
                        key={hostel.id}
                        hostel={hostel}
                        isOwner={true}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>
        </div>
    );
};

export default OwnerDashboard;
