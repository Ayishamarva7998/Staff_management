import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:4500/api/common',
});


export const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = ` ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getDatafromId  = (id) => api.get(`/profile/${id}`);


export const updatePassword = (Id, passwordData) => api.put(`/password/${Id}`, passwordData);