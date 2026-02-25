import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, MapPin, Phone, Mail, BedDouble,
    CheckCircle2, Wifi, Shield, Star, ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const BACKEND = 'http://localhost:5000';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop';

const resolveImageUrl = (url) => {
    if (!url) return FALLBACK_IMG;
    return url.startsWith('http') ? url : `${BACKEND}${url}`;
};

// ── Helper style function (must be before HostelDetails component) ──
const arrowBtnStyle = (side) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '14px', zIndex: 2,
    background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
    width: '40px', height: '40px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: '#fff',
    backdropFilter: 'blur(4px)', transition: 'background 0.2s'
});

// ── Sub-components (must be before HostelDetails component) ──
const StatBox = ({ icon, label, value, highlight }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 16px', borderRadius: 'var(--radius-md)',
        background: highlight ? 'rgba(16,185,129,0.07)' : 'var(--background)',
        border: `1px solid ${highlight ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`
    }}>
        <div style={{ flexShrink: 0 }}>{icon}</div>
        <div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</p>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '1.3rem' }}>{value}</p>
        </div>
    </div>
);

const ContactRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
        <div style={{ marginTop: '2px', flexShrink: 0 }}>{icon}</div>
        <div>
            <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', wordBreak: 'break-word' }}>{value}</p>
        </div>
    </div>
);

const HostelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        const fetchHostel = async () => {
            try {
                const res = await axios.get(`${BACKEND}/api/v1/hostels/${id}`);
                setHostel(res.data.data.hostel);
            } catch (err) {
                setError('Failed to load hostel details.');
            } finally {
                setLoading(false);
            }
        };
        fetchHostel();
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '4px solid var(--border)', borderTopColor: 'var(--primary)',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading hostel details…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    if (error || !hostel) return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{error || 'Hostel not found.'}</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    // Normalize images
    let images = hostel.hostel_image_url;
    if (!Array.isArray(images)) images = images ? [images] : [];
    if (images.length === 0) images = [null];
    const resolvedImages = images.map(resolveImageUrl);

    const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];
    const hasMap = hostel.latitude && hostel.longitude;

    const prevImg = () => setActiveImg(i => (i - 1 + resolvedImages.length) % resolvedImages.length);
    const nextImg = () => setActiveImg(i => (i + 1) % resolvedImages.length);

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', fontSize: '0.9rem',
                    marginBottom: '20px', padding: '6px 0'
                }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            {/* Hero image carousel */}
            <div style={{
                position: 'relative', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', height: '420px', marginBottom: '28px',
                background: '#0a0a0a', boxShadow: '0 8px 40px rgba(0,0,0,0.3)'
            }}>
                <img
                    src={resolvedImages[activeImg]}
                    alt={`Hostel image ${activeImg + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                />

                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)'
                }} />

                {/* Hostel name on image */}
                <div style={{
                    position: 'absolute', bottom: '24px', left: '28px', right: '28px'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                        {hostel.name}
                    </h1>
                    {hostel.address && (
                        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={14} /> {hostel.address}
                        </p>
                    )}
                </div>

                {/* Navigation arrows – only if multiple images */}
                {resolvedImages.length > 1 && (
                    <>
                        <button onClick={prevImg} style={arrowBtnStyle('left')}>
                            <ChevronLeft size={22} />
                        </button>
                        <button onClick={nextImg} style={arrowBtnStyle('right')}>
                            <ChevronRight size={22} />
                        </button>
                        {/* Dot indicators */}
                        <div style={{ position: 'absolute', bottom: '12px', right: '24px', display: 'flex', gap: '6px' }}>
                            {resolvedImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    style={{
                                        width: i === activeImg ? '20px' : '8px', height: '8px',
                                        borderRadius: '4px', border: 'none', cursor: 'pointer',
                                        background: i === activeImg ? '#fff' : 'rgba(255,255,255,0.4)',
                                        transition: 'all 0.25s ease', padding: 0
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Thumbnail strip */}
                {resolvedImages.length > 1 && (
                    <div style={{
                        position: 'absolute', top: '16px', right: '16px',
                        display: 'flex', flexDirection: 'column', gap: '6px'
                    }}>
                        {resolvedImages.slice(0, 4).map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`thumb ${i}`}
                                onClick={() => setActiveImg(i)}
                                onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                style={{
                                    width: '56px', height: '42px', objectFit: 'cover',
                                    borderRadius: '6px', cursor: 'pointer',
                                    border: i === activeImg ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.3)',
                                    opacity: i === activeImg ? 1 : 0.7, transition: 'all 0.2s'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main content grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Description */}
                    {hostel.description && (
                        <section className="card" style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600' }}>About this Hostel</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>{hostel.description}</p>
                        </section>
                    )}

                    {/* Room stats */}
                    <section className="card" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '600' }}>Room Availability</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <StatBox icon={<BedDouble size={22} color="var(--primary)" />}
                                label="Total Rooms" value={hostel.number_of_rooms} />
                            <StatBox icon={<Users size={22} color="var(--secondary)" />}
                                label="Available Rooms" value={hostel.available_rooms}
                                highlight={hostel.available_rooms > 0} />
                        </div>
                    </section>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <section className="card" style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '600' }}>Amenities</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {amenities.map((a, i) => (
                                    <span key={i} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem',
                                        background: 'rgba(79, 70, 229, 0.08)',
                                        color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.2)',
                                        fontWeight: '500'
                                    }}>
                                        <CheckCircle2 size={13} /> {a}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Rules */}
                    {hostel.rules && (
                        <section className="card" style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={18} color="var(--primary)" /> House Rules
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0, whiteSpace: 'pre-line' }}>
                                {hostel.rules}
                            </p>
                        </section>
                    )}

                    {/* Map */}
                    {hasMap && (
                        <section className="card" style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={18} color="var(--primary)" /> Location on Map
                            </h2>
                            <div style={{ height: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                <MapContainer
                                    center={[parseFloat(hostel.latitude), parseFloat(hostel.longitude)]}
                                    zoom={15} style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[parseFloat(hostel.latitude), parseFloat(hostel.longitude)]}>
                                        <Popup>{hostel.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </section>
                    )}
                </div>

                {/* Right column – contact card */}
                <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>
                                ₹{hostel.price} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ Month</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Star size={18} fill="var(--primary)" color="var(--primary)" />
                                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Premium Stay</span>
                            </div>
                        </div>

                        {hostel.hostel_email && (
                            <ContactRow icon={<Mail size={16} color="var(--primary)" />} label="Email" value={hostel.hostel_email} />
                        )}
                        {hostel.phone_number && (
                            <ContactRow icon={<Phone size={16} color="var(--secondary)" />} label="Phone" value={hostel.phone_number} />
                        )}
                        {hostel.address && (
                            <ContactRow icon={<MapPin size={16} color="#f59e0b" />} label="Address" value={hostel.address} />
                        )}

                        {/* Availability badge */}
                        <div style={{
                            marginTop: '20px', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                            background: hostel.available_rooms > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                            border: `1px solid ${hostel.available_rooms > 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: hostel.available_rooms > 0 ? 'var(--secondary)' : '#ef4444' }}>
                                {hostel.available_rooms > 0 ? `${hostel.available_rooms} Rooms Available` : 'Currently Full'}
                            </p>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '13px' }}>
                            Book a Visit
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%', marginTop: '10px', padding: '13px' }}>
                            Book a Room
                        </button>
                    </div>

                    {/* Quick stats */}
                    <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <p style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: 'var(--primary)' }}>{hostel.number_of_rooms}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Total Rooms</p>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div>
                            <p style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: 'var(--secondary)' }}>{hostel.available_rooms}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Available</p>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div>
                            <p style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#f59e0b' }}>{amenities.length}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Amenities</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostelDetails;
