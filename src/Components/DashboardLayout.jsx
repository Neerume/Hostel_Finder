import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Building2,
    LayoutDashboard,
    Search,
    CalendarCheck,
    User,
    LogOut,
    Menu,
    PlusCircle,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onClick}
        end
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Close sidebar on route change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userLinks = [
        { to: '/user/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        // Mock links since we don't have separate pages for these yet, but dashboard has the list
        { to: '/user/profile', icon: <User size={20} />, label: 'Edit Profile' },
    ];

    const ownerLinks = [
        { to: '/owner/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/owner/add-hostel', icon: <PlusCircle size={20} />, label: 'Add Hostel' },
        { to: '/owner/profile', icon: <User size={20} />, label: 'Edit Profile' },
    ];

    const links = role === 'owner' ? ownerLinks : userLinks;

    return (
        <div className="dashboard-layout">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5 }}
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? '' : 'mobile-hidden'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                        <Building2 size={24} />
                        HostelFinder
                    </div>
                    <button className="md:hidden" onClick={toggleSidebar} style={{ display: 'block' }}>
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {links.map((link, idx) => (
                        <SidebarItem
                            key={idx}
                            to={link.to}
                            icon={link.icon}
                            label={link.label}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-4)' }}>
                    <button
                        className="nav-link w-full"
                        style={{ color: '#ef4444', justifyContent: 'flex-start' }}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                        <button
                            onClick={toggleSidebar}
                            style={{ display: 'block' }}
                            className="mobile-menu-btn"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                            {role === 'owner' ? 'Owner Portal' : 'Student Portal'}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.fullname ? user.fullname.substring(0, 2).toUpperCase() : (role === 'owner' ? 'OW' : 'US')}
                        </div>
                    </div>
                </header>

                {/* Page Content Rendering */}
                <div className="page-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// Add a quick hack for responsiveness
const style = document.createElement('style');
style.textContent = `
  @media (min-width: 769px) {
    .mobile-menu-btn { display: none !important; }
  }
  @media (max-width: 768px) {
    .md\\:hidden { display: block !important; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

export default DashboardLayout;
