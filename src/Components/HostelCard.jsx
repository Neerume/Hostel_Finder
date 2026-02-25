import React from 'react';
import { MapPin, Users, CheckCircle2 } from 'lucide-react';

const HostelCard = ({ hostel, isOwner, onBookVisit, onBookRoom, onViewDetails, isGuest }) => {
    return (
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    height: '200px',
                    background: 'var(--background)',
                    backgroundImage: `url("${hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{hostel.name}</h3>
                    <span style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--secondary)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>
                        ₹{hostel.price}/mo
                    </span>
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-3)' }}>
                    <MapPin size={14} />
                    {hostel.location}
                </p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-4)', flex: 1 }}>
                    {hostel.description}
                </p>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
                        <Users size={16} color="var(--primary)" />
                        {hostel.availableRooms} / {hostel.totalRooms} available
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
                        <CheckCircle2 size={16} color="var(--secondary)" />
                        Verified
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'auto' }}>
                    <button
                        className="btn btn-primary w-full"
                        onClick={() => onViewDetails(hostel.id)}
                    >
                        {isGuest ? 'Login to View' : 'View Details'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HostelCard;
