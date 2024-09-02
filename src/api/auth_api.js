import axios from "axios";

const api = axios.create({
    baseURL: 'https://staff-management-server.onrender.com/api',
});

// API call for login
export const login = (credentials) => api.post('/login', credentials);