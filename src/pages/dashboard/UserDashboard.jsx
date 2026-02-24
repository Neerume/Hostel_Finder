import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import HostelCard from '../../components/HostelCard';

// Dummy Data
const DUMMY_HOSTELS = [
    {
        id: 1,
        name: 'Greenwood Student Living',
        location: 'Downtown, Sector 4',
        description: 'Modern student accommodation with fast Wi-Fi and 24/7 security.',
        price: 8000,
        availableRooms: 5,
        totalRooms: 50,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Sunrise Hostel',
        location: 'North Campus, Phase 1',
        description: 'Affordable, clean rooms offering 3 meals a day and laundry service.',
        price: 6500,
        availableRooms: 12,
        totalRooms: 40,
        image: 'https://images.unsplash.com/photo-1522771731470-eeeb6e949988?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'The Elite Stay',
        location: 'South City Main',
        description: 'Premium AC rooms with attached bathrooms and gym facility.',
        price: 12000,
        availableRooms: 2,
        totalRooms: 20,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop'
    }
];

const UserDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleBookVisit = (id) => {
        alert(`Appointment requested for visit to Hostel ID: ${id}`);
    };

    const handleBookRoom = (id) => {
        alert(`Booking initiated for Hostel ID: ${id}`);
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Discover Hostels</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Find the perfect place that feels like home.</p>
            </div>

            {/* Search Bar */}
            <div className="card" style={{ padding: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by hostel name..."
                        style={{ width: '100%', padding: '12px 12px 12px 36px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                        <MapPin size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Location"
                        style={{ width: '100%', padding: '12px 12px 12px 36px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                    />
                </div>

                <button className="btn btn-primary" style={{ flex: '0 0 auto' }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Hostel Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                {DUMMY_HOSTELS.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())).map(hostel => (
                    <HostelCard
                        key={hostel.id}
                        hostel={hostel}
                        isOwner={false}
                        onBookVisit={handleBookVisit}
                        onBookRoom={handleBookRoom}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
