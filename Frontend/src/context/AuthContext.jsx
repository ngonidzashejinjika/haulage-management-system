import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');
        if (token && username) {
            setUser({ username });
        }
    }, []);

    const register = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            await authService.register(username, password);
            return { success: true };
        } catch (err) {
            let message = 'Registration failed';
            if (err.response?.status === 409) {
                message = 'Username already exists';
            } else if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data?.details) {
                message = err.response.data.details;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
            console.error('Registration error:', err);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(username, password);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
            setUser({ username });
            return { success: true };
        } catch (err) {
            let message = 'Login failed';
            if (err.response?.status === 401) {
                message = 'Invalid username or password';
            } else if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
            console.error('Login error:', err);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setError(null);
    }, []);

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
