import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists on initial load
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const loginUser = async (email, password) => {
        const response = await api.post('/auth/user/login', { email, password });
        const { data } = response.data;
        const { user: userData, tokens } = data;

        setToken(tokens.accessToken);
        setUser({ ...userData, role: 'user' });

        localStorage.setItem('token', tokens.accessToken);
        localStorage.setItem('user', JSON.stringify({ ...userData, role: 'user' }));

        return response.data;
    };

    const loginOwner = async (email, password) => {
        const response = await api.post('/auth/owner/login', { email, password });
        const { data } = response.data;
        const { owner: userData, tokens } = data;

        setToken(tokens.accessToken);
        setUser({ ...userData, role: 'owner' });

        localStorage.setItem('token', tokens.accessToken);
        localStorage.setItem('user', JSON.stringify({ ...userData, role: 'owner' }));

        return response.data;
    };

    const registerUser = async (userData) => {
        const response = await api.post('/auth/user/register', userData);
        return response.data;
    };

    const registerOwner = async (ownerData) => {
        const response = await api.post('/auth/owner/register', ownerData);
        return response.data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loginUser,
            loginOwner,
            registerUser,
            registerOwner,
            logout,
            updateUser,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
