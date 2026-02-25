import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldCheck, CalendarCheck, LayoutDashboard, Loader2 } from 'lucide-react';
import api from '../utils/api';
import HostelCard from '../components/HostelCard';

const Landing = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await api.get('/hostels');
                setHostels(res.data.data.hostels.slice(0, 6)); // Show top 6
            } catch (error) {
                console.error("Failed to fetch hostels:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHostels();
    }, []);

    const handleViewDetails = (id) => {
        navigate('/login/user');
    };

    return (
        <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar equivalent for landing */}
            <header style={{ padding: 'var(--spacing-4) var(--spacing-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    <Building2 size={28} />
                    HostelFinder
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                    <Link to="/login/user" className="btn btn-outline">User Login</Link>
                    <Link to="/login/owner" className="btn btn-primary">Owner Login</Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flex: 1 }}>
                <section style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white' }}>
                    <div className="mx-auto" style={{ maxWidth: '800px' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', lineHeight: 1.2 }}>Find and Manage Hostels Effortlessly</h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: 'var(--spacing-8)', maxWidth: '600px', margin: '0 auto var(--spacing-8)' }}>
                            The ultimate platform for students to find affordable rooms and for owners to manage their properties, bookings, and communication in one place.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)' }}>
                            <Link to="/login/user" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '12px 24px', fontSize: '1.1rem' }}>Find a Room</Link>
                            <Link to="/login/owner" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '12px 24px', fontSize: '1.1rem' }}>List your Property</Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="text-center mb-8" style={{ fontSize: '2rem' }}>Why choose HostelFinder?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)' }}>
                        {/* Features cards... */}
                        <div className="card text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: 'var(--spacing-4)' }}>
                                <Building2 size={48} />
                            </div>
                            <h3 className="mb-2">Affordable Rooms</h3>
                            <p className="text-muted">Browse through hundreds of budget-friendly accommodations tailored for students.</p>
                        </div>

                        <div className="card text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--secondary)', marginBottom: 'var(--spacing-4)' }}>
                                <ShieldCheck size={48} />
                            </div>
                            <h3 className="mb-2">Verified Listings</h3>
                            <p className="text-muted">Every hostel is verified to ensure safety, quality, and accurate information.</p>
                        </div>

                        <div className="card text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: '#f59e0b', marginBottom: 'var(--spacing-4)' }}>
                                <CalendarCheck size={48} />
                            </div>
                            <h3 className="mb-2">Easy Booking</h3>
                            <p className="text-muted">Book a visit or reserve your room instantly with just a few clicks.</p>
                        </div>

                        <div className="card text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: '#8b5cf6', marginBottom: 'var(--spacing-4)' }}>
                                <LayoutDashboard size={48} />
                            </div>
                            <h3 className="mb-2">Owner Dashboard</h3>
                            <p className="text-muted">Comprehensive tools for owners to track bookings, availability, and revenue.</p>
                        </div>
                    </div>
                </section>

                {/* New: Featured Hostels Section */}
                <section style={{ padding: '80px 20px', backgroundColor: 'var(--surface-alt)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>Featured Hostels</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Explore some of our top-rated accommodations.</p>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                                {hostels.map(hostel => (
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
                                        isGuest={true}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-8)' }}>
                            <Link to="/login/user" className="btn btn-outline" style={{ padding: '12px 32px' }}>
                                View All Hostels
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{ background: 'var(--surface)', padding: 'var(--spacing-6)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>
                    &copy; {new Date().getFullYear()} HostelFinder. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
