import React, { useState, useEffect } from 'react';
import { driverService } from '../services/driverService';
import '../styles/Dashboard.css';

export const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        licenseNumber: '',
        phoneNumber: '',
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await driverService.getAllDrivers();
            setDrivers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch drivers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name.trim()) {
                throw new Error('Driver name is required');
            }
            if (!formData.licenseNumber.trim()) {
                throw new Error('License number is required');
            }

            if (editingId) {
                await driverService.updateDriver(
                    editingId,
                    formData.name.trim(),
                    formData.licenseNumber.trim(),
                    formData.phoneNumber.trim()
                );
            } else {
                await driverService.createDriver(
                    formData.name.trim(),
                    formData.licenseNumber.trim(),
                    formData.phoneNumber.trim()
                );
            }

            await fetchDrivers();
            setError('');
            setFormData({ name: '', licenseNumber: '', phoneNumber: '' });
            setShowForm(false);
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save driver');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        try {
            await driverService.deleteDriver(id);
            await fetchDrivers();
        } catch (err) {
            setError('Failed to delete driver');
        }
    };

    const handleEdit = (driver) => {
        setEditingId(driver.driverId);
        setFormData({
            name: driver.name,
            licenseNumber: driver.licenseNumber,
            phoneNumber: driver.phoneNumber,
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', licenseNumber: '', phoneNumber: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Drivers</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add Driver'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Driver' : 'Add New Driver'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>License Number</label>
                                <input
                                    type="text"
                                    value={formData.licenseNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, licenseNumber: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phoneNumber: e.target.value })
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
                            <th>Name</th>
                            <th>License Number</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.driverId}>
                                <td>{driver.driverId}</td>
                                <td>{driver.name}</td>
                                <td>{driver.licenseNumber}</td>
                                <td>{driver.phoneNumber}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(driver)}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(driver.driverId)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {drivers.length === 0 && !loading && (
                    <p className="empty-state">No drivers yet. Create one to get started!</p>
                )}
            </div>
        </div>
    );
};
