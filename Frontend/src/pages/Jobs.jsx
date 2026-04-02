import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { driverService } from '../services/driverService';
import { truckService } from '../services/truckService';
import '../styles/Dashboard.css';

export const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        truckId: '',
        driverId: '',
        pickupLocation: '',
        deliveryLocation: '',
        cargoDescription: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, driversRes, trucksRes] = await Promise.all([
                jobService.getAllJobs(),
                driverService.getAllDrivers(),
                truckService.getAllTrucks(),
            ]);
            setJobs(jobsRes.data);
            setDrivers(driversRes.data);
            setTrucks(trucksRes.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch jobs, drivers, or trucks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await jobService.getAllJobs();
            setJobs(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch jobs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrucks = async () => {
        try {
            const response = await truckService.getAllTrucks();
            setTrucks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.truckId || !formData.driverId) {
                throw new Error('Select both truck and driver');
            }
            if (!formData.pickupLocation.trim() || !formData.deliveryLocation.trim()) {
                throw new Error('Pickup and delivery locations are required');
            }

            if (!editingId) {
                await jobService.createJob(
                    Number(formData.truckId),
                    Number(formData.driverId),
                    formData.pickupLocation.trim(),
                    formData.deliveryLocation.trim(),
                    formData.cargoDescription.trim()
                );
            } else {
                await jobService.updateJobStatus(editingId, formData.status || 'PENDING');
            }

            await fetchData();
            setFormData({
                truckId: '',
                driverId: '',
                pickupLocation: '',
                deliveryLocation: '',
                cargoDescription: '',
            });
            setShowForm(false);
            setEditingId(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save job');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await jobService.updateJobStatus(jobId, newStatus);
            await Promise.all([fetchJobs(), fetchTrucks()]);
        } catch (err) {
            setError('Failed to update job status');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            truckId: '',
            driverId: '',
            pickupLocation: '',
            deliveryLocation: '',
            cargoDescription: '',
        });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Jobs</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Create Job'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Job</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Truck</label>
                                <select
                                    value={formData.truckId}
                                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select a truck</option>
                                    {trucks
                                        .filter((truck) => truck.status === 'AVAILABLE')
                                        .map((truck) => (
                                            <option key={truck.truckId} value={truck.truckId}>
                                                {truck.registrationNumber} ({truck.status})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Driver</label>
                                <select
                                    value={formData.driverId}
                                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select a driver</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.driverId} value={driver.driverId}>
                                            {driver.name} ({driver.licenseNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Pickup Location</label>
                                <input
                                    type="text"
                                    value={formData.pickupLocation}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pickupLocation: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Delivery Location</label>
                                <input
                                    type="text"
                                    value={formData.deliveryLocation}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deliveryLocation: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cargo Description</label>
                                <textarea
                                    value={formData.cargoDescription}
                                    onChange={(e) =>
                                        setFormData({ ...formData, cargoDescription: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Job'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && !showForm && <p>Loading...</p>}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Truck</th>
                            <th>Driver</th>
                            <th>Pickup</th>
                            <th>Delivery</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.jobId}>
                                <td>{job.jobId}</td>
                                <td>{trucks.find((t) => t.truckId === job.assignedTruckId)?.registrationNumber || `#${job.assignedTruckId}`}</td>
                                <td>{drivers.find((d) => d.driverId === job.assignedDriverId)?.name || `#${job.assignedDriverId}`}</td>
                                <td>{job.pickupLocation}</td>
                                <td>{job.deliveryLocation}</td>
                                <td>
                                    <select
                                        value={job.status}
                                        onChange={(e) =>
                                            handleStatusChange(job.jobId, e.target.value)
                                        }
                                        className={`status-select status-${job.status.toLowerCase()}`}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="ASSIGNED">Assigned</option>
                                        <option value="IN_TRANSIT">In Transit</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => alert(job.cargoDescription)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && !loading && (
                    <p className="empty-state">No jobs yet. Create one to get started!</p>
                )}
            </div>
        </div>
    );
};
