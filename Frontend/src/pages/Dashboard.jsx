import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../services/driverService';
import { truckService } from '../services/truckService';
import { jobService } from '../services/jobService';
import '../styles/Dashboard.css';

export const Dashboard = () => {
    const [counts, setCounts] = useState({
        drivers: 0,
        trucks: 0,
        jobs: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [driversRes, trucksRes, jobsRes] = await Promise.all([
                    driverService.getAllDrivers(),
                    truckService.getAllTrucks(),
                    jobService.getAllJobs()
                ]);

                setCounts({
                    drivers: driversRes.data.length,
                    trucks: trucksRes.data.length,
                    jobs: jobsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const handleCardClick = (route) => {
        navigate(route);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-grid">
                <div
                    className="dashboard-card clickable"
                    onClick={() => handleCardClick('/drivers')}
                >
                    <h3>Drivers</h3>
                    <div className="card-count">
                        {loading ? '...' : counts.drivers}
                    </div>
                    <p className="card-description">Manage your drivers and their assignments</p>
                </div>

                <div
                    className="dashboard-card clickable"
                    onClick={() => handleCardClick('/trucks')}
                >
                    <h3>Trucks</h3>
                    <div className="card-count">
                        {loading ? '...' : counts.trucks}
                    </div>
                    <p className="card-description">Monitor your vehicle fleet and their status</p>
                </div>

                <div
                    className="dashboard-card clickable"
                    onClick={() => handleCardClick('/jobs')}
                >
                    <h3>Jobs</h3>
                    <div className="card-count">
                        {loading ? '...' : counts.jobs}
                    </div>
                    <p className="card-description">Track and manage haulage jobs in real-time</p>
                </div>
            </div>

            <div className="dashboard-info">
                <h2>Welcome to Haulage Management System</h2>
                <p>
                    This system allows you to efficiently manage your haulage operations,
                    including drivers, trucks, and job assignments. Click on any card above
                    to access the respective management section.
                </p>
            </div>
        </div>
    );
};
