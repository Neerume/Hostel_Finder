import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon
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

const LocationPicker = ({ position, setPosition, onLocationName }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });

            // Reverse geocode using Nominatim
            try {
                const resp = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await resp.json();
                const name =
                    data.address?.road
                        ? [
                            data.address.road,
                            data.address.suburb || data.address.city_district,
                            data.address.city || data.address.town || data.address.village,
                            data.address.country,
                        ]
                            .filter(Boolean)
                            .join(', ')
                        : data.display_name || '';
                onLocationName(name);
            } catch (err) {
                console.warn('Reverse geocoding failed:', err);
            }
        },
    });
    return position === null ? null : <Marker position={position} />;
};

const AddHostel = () => {
    const navigate = useNavigate();
    const [amenities, setAmenities] = useState(['WiFi', 'AC', 'Laundry']);
    const [newVal, setNewVal] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [position, setPosition] = useState({ lat: 27.7172, lng: 85.3240 });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        rules: '',
        totalRooms: '',
        availableRooms: '',
        price: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationName = useCallback((name) => {
        setFormData(prev => ({ ...prev, address: name }));
    }, []);

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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setImages(files);
            // Generate preview URLs
            const previews = files.map(f => URL.createObjectURL(f));
            setImagePreviews(previews);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();

            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('address', formData.address);
            data.append('hostel_email', formData.email);
            data.append('phone_number', formData.phone);
            data.append('rules', formData.rules);
            data.append('number_of_rooms', parseInt(formData.totalRooms, 10));
            data.append('available_rooms', parseInt(formData.availableRooms, 10));
            data.append('price', parseInt(formData.price, 10));
            data.append('amenities', JSON.stringify(amenities));

            if (position) {
                data.append('latitude', position.lat);
                data.append('longitude', position.lng);
            }

            images.forEach((image) => {
                data.append('images', image);
            });

            await axios.post('http://localhost:5000/api/v1/hostels/add', data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Hostel added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding hostel:', error);
            alert(error.response?.data?.message || 'Failed to add hostel. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Add New Hostel</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Fill out the property details below to list it on our platform.</p>
            </div>

            <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>

                        {/* Hostel Name */}
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Hostel Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="E.g. Student Oasis" />
                        </div>

                        {/* Description */}
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required placeholder="Describe your hostel..."></textarea>
                        </div>

                        {/* Total Rooms, Available Rooms, Price */}
                        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-4)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Total Rooms</label>
                                <input
                                    type="number"
                                    name="totalRooms"
                                    placeholder="e.g. 20"
                                    value={formData.totalRooms}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Available Rooms</label>
                                <input
                                    type="number"
                                    name="availableRooms"
                                    placeholder="e.g. 5"
                                    value={formData.availableRooms}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Monthly Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="e.g. 8000"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                        </div>

                        {/* Address + Map side by side */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Address &amp; Location
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', alignItems: 'start' }}>

                                {/* Address input column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="input-group" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location Name</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            placeholder="Click map to auto-fill, or type manually"
                                        />
                                    </div>
                                    {position && (
                                        <div style={{
                                            padding: '10px 12px',
                                            background: 'rgba(79, 70, 229, 0.06)',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid rgba(79, 70, 229, 0.2)',
                                            fontSize: '0.82rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: '1.6'
                                        }}>
                                            <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '2px' }}>📍 Pinned Coordinates</div>
                                            <div>Latitude: <strong>{position.lat.toFixed(6)}</strong></div>
                                            <div>Longitude: <strong>{position.lng.toFixed(6)}</strong></div>
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                        💡 Click anywhere on the map to pin your hostel and auto-fill the address.
                                    </p>
                                </div>

                                {/* Map column */}
                                <div style={{ height: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <MapContainer center={[27.7172, 85.3240]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker
                                            position={position}
                                            setPosition={setPosition}
                                            onLocationName={handleLocationName}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div className="input-group">
                            <label>Contact Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="hostel@example.com" />
                        </div>

                        {/* Phone */}
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+977 XXXXXXXXXX" />
                        </div>

                        {/* Amenities */}
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

                        {/* Rules */}
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Hostel Rules</label>
                            <textarea name="rules" value={formData.rules} onChange={handleChange} rows="2" placeholder="Gate closing time, visitor policy, etc."></textarea>
                        </div>

                        {/* Image Upload */}
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Upload Hostel Images</label>
                            <div style={{
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-6)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--background)'
                            }}>
                                <UploadCloud size={40} color="var(--text-secondary)" />
                                <p style={{ color: 'var(--text-secondary)' }}>Select multiple images for your hostel</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ marginTop: '8px' }}
                                />
                                {images.length > 0 && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--primary)', marginTop: '4px' }}>
                                        {images.length} file(s) selected
                                    </p>
                                )}
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                                    gap: '10px',
                                    marginTop: '14px'
                                }}>
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <img
                                                src={src}
                                                alt={`Preview ${i + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '90px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--border)'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
