import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

export const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h2>Haulage Management</h2>
                </div>

                <div className="navbar-menu">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/drivers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Drivers
                    </NavLink>
                    <NavLink to="/trucks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Trucks
                    </NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Jobs
                    </NavLink>
                </div>

                <div className="navbar-user">
                    <span className="username">{user?.username}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};
