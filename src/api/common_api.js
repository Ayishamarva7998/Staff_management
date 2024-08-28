import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:4500/api/common',
});


export const setcommonToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = ` ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getDatafromId  = (id) => api.get(`/profile/${id}`);


export const updatePassword = (Id, passwordData) => api.put(`/password/${Id}`, passwordData);


export const getstacks= ()=>api.get('/stacks');
export const getbatches=()=>api.get('/batches');


export const addEventInCalender = (id)=>api.get(`/event/${id}`)