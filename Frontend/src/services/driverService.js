import api from './api';

export const driverService = {
    createDriver: (name, licenseNumber, phoneNumber) =>
        api.post('/drivers', { name, licenseNumber, phoneNumber }),

    getDriver: (id) =>
        api.get(`/drivers/${id}`),

    getAllDrivers: () =>
        api.get('/drivers'),

    updateDriver: (id, name, licenseNumber, phoneNumber) =>
        api.put(`/drivers/${id}`, { name, licenseNumber, phoneNumber }),

    deleteDriver: (id) =>
        api.delete(`/drivers/${id}`),
};
