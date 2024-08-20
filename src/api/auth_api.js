import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:4500/api',
});

// API call for login
export const login = (credentials) => api.post('/login', credentials);