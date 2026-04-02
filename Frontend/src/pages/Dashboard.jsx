import React from 'react';
import '../styles/Dashboard.css';

export const Dashboard = () => {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Drivers</h3>
                    <p className="card-description">Manage your drivers and their assignments</p>
                </div>

                <div className="dashboard-card">
                    <h3>Trucks</h3>
                    <p className="card-description">Monitor your vehicle fleet and their status</p>
                </div>

                <div className="dashboard-card">
                    <h3>Jobs</h3>
                    <p className="card-description">Track and manage haulage jobs in real-time</p>
                </div>
            </div>

            <div className="dashboard-info">
                <h2>Welcome to Haulage Management System</h2>
                <p>
                    This system allows you to efficiently manage your haulage operations,
                    including drivers, trucks, and job assignments. Use the navigation menu
                    to access different sections.
                </p>
            </div>
        </div>
    );
};
