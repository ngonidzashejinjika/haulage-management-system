import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Drivers } from './pages/Drivers';
import { Trucks } from './pages/Trucks';
import { Jobs } from './pages/Jobs';
import './styles/App.css';

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            {isAuthenticated && <Navigation />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/drivers"
                    element={
                        <PrivateRoute>
                            <Drivers />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/trucks"
                    element={
                        <PrivateRoute>
                            <Trucks />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/jobs"
                    element={
                        <PrivateRoute>
                            <Jobs />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <div className="app-shell">
                <AppContent />
            </div>
        </AuthProvider>
    );
}

export default App;
