import React, { useState, useEffect } from 'react';
import { truckService } from '../services/truckService';
import '../styles/Dashboard.css';

export const Trucks = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        registrationNumber: '',
        capacity: '',
    });

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        setLoading(true);
        try {
            const response = await truckService.getAllTrucks();
            setTrucks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch trucks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.registrationNumber.trim()) {
                throw new Error('Registration Number is required');
            }
            const capacityValue = parseFloat(formData.capacity);
            if (Number.isNaN(capacityValue) || capacityValue <= 0) {
                throw new Error('Capacity must be a positive number');
            }

            if (editingId) {
                await truckService.updateTruck(
                    editingId,
                    formData.registrationNumber.trim(),
                    capacityValue
                );
            } else {
                await truckService.createTruck(
                    formData.registrationNumber,
                    capacityValue
                );
            }

            await fetchTrucks();
            setError('');
            setFormData({ registrationNumber: '', capacity: '' });
            setShowForm(false);
            setEditingId(null);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to save truck'
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        try {
            await truckService.deleteTruck(id);
            await fetchTrucks();
        } catch (err) {
            setError('Failed to delete truck');
        }
    };

    const handleEdit = (truck) => {
        setEditingId(truck.truckId);
        setFormData({
            registrationNumber: truck.registrationNumber,
            capacity: truck.capacity,
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ registrationNumber: '', capacity: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Trucks</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add Truck'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Truck' : 'Add New Truck'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Registration Number</label>
                                <input
                                    type="text"
                                    value={formData.registrationNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, registrationNumber: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacity (tons)</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, capacity: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
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
                            <th>Registration Number</th>
                            <th>Capacity (tons)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trucks.map((truck) => (
                            <tr key={truck.truckId}>
                                <td>{truck.truckId}</td>
                                <td>{truck.registrationNumber}</td>
                                <td>{truck.capacity}</td>
                                <td>
                                    <span className={`status-${truck.status.toLowerCase()}`}>
                                        {truck.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(truck)}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(truck.truckId)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {trucks.length === 0 && !loading && (
                    <p className="empty-state">No trucks yet. Create one to get started!</p>
                )}
            </div>
        </div>
    );
};
