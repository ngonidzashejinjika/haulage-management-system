import api from './api';

export const jobService = {
    createJob: (truckId, driverId, pickupLocation, deliveryLocation, cargoDescription) =>
        api.post('/jobs', {
            truckId,
            driverId,
            pickupLocation,
            deliveryLocation,
            cargoDescription,
        }),

    getJob: (id) =>
        api.get(`/jobs/${id}`),

    getAllJobs: () =>
        api.get('/jobs'),

    updateJobStatus: (id, status) =>
        api.patch(`/jobs/${id}/status`, { status }),
};
