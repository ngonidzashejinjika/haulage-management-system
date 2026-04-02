import api from './api';

export const truckService = {
    createTruck: (registrationNumber, capacity) =>
        api.post('/trucks', { registrationNumber, capacity }),

    getTruck: (id) =>
        api.get(`/trucks/${id}`),

    getAllTrucks: () =>
        api.get('/trucks'),

    updateTruck: (id, registrationNumber, capacity) =>
        api.put(`/trucks/${id}`, { registrationNumber, capacity }),

    deleteTruck: (id) =>
        api.delete(`/trucks/${id}`),
};
