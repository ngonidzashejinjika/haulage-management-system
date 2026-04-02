import api from './api';

export const authService = {
    register: (username, password) =>
        api.post('/auth/register', { username, password }),

    login: (username, password) =>
        api.post('/auth/login', { username, password }),

    logout: () => {
        localStorage.removeItem('authToken');
    },
};
