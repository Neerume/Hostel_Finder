import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HostelCard from '../../components/HostelCard';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/hostels');
                setHostels(res.data.data.hostels);
            } catch (error) {
                console.error("Failed to fetch hostels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHostels();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/user/hostel/${id}`);
    };

    const filteredHostels = hostels.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        placeholder="Search by hostel name or address..."
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
                        placeholder="Location filtering coming soon..."
                        style={{ width: '100%', padding: '12px 12px 12px 36px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                        readOnly
                    />
                </div>

                <button className="btn btn-primary" style={{ flex: '0 0 auto' }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Hostel Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                {loading ? (
                    <p>Loading hostels...</p>
                ) : filteredHostels.length === 0 ? (
                    <p>No hostels found matching your search.</p>
                ) : (
                    filteredHostels.map(hostel => (
                        <HostelCard
                            key={hostel.hostel_id}
                            hostel={{
                                ...hostel,
                                id: hostel.hostel_id,
                                location: hostel.address,
                                image: (() => {
                                    const urls = hostel.hostel_image_url;
                                    const first = Array.isArray(urls) && urls.length > 0
                                        ? urls[0]
                                        : (typeof urls === 'string' && urls ? urls : null);
                                    if (!first) return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop';
                                    return first.startsWith('http') ? first : `http://localhost:5000${first}`;
                                })(),
                                totalRooms: hostel.number_of_rooms,
                                availableRooms: hostel.available_rooms,
                                price: hostel.price || 0
                            }}
                            isOwner={false}
                            onViewDetails={handleViewDetails}
                        />
                    ))
                )}
            </div>

            {/* CSS to ensure grid works correctly (minmax issue fix in case of too many cards) */}
            <style>{`
                div[style*="grid-template-columns"] {
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
