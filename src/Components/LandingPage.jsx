import React from 'react';
import { Building2, User, House } from 'lucide-react'; // This is the missing piece!
import '../CSS/LandingPage.css'; 

const LandingPage = () => {
    return(
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Building2 size={24} color="#2563eb" />
          <span>HostelFinder</span>
        </div>
        <div className="nav-buttons">
          <button className="btn-user">
            <User size={18} /> Login as User
          </button>
          <button className="btn-owner">
            <House size={18} /> Login as Owner
          </button>
        </div>
      </nav>

      {/* Text */}
      <header className="hero-section">
        <h1>Find Your Perfect Hostel</h1>
        <p>
          Discover comfortable and affordable hostels around the valley. 
          Connect with fellow travelers and create unforgettable memories.
        </p>
      </header>

      {/* Hostel Image */}
      <div className="image-container">
        <img 
          src="https://images.unsplash.com/photo-1555854817-5b2247a8175f?auto=format&fit=crop&w=1200&q=80" 
          alt="Hostel Pods" 
          className="main-hero-image"
        />
      </div>
    </div>
    );
};

export default LandingPage;