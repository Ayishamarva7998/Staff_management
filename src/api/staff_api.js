import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:4500/api/staff',
});


export const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = ` ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// timeslot 

export const timeslot = ()=>api.get('/timeslots');

export const createtimeslot =(cratedata)=>api.post('/createtimeslot',cratedata);

export const updatetimeslot =(id, updatedata)=>api.put(`/updatetimeslot/${id}`,updatedata);

export const deleteTimeslot = (id) => api.delete(`/deletetimeslot/${id}`);

export const getreviewertimeslots =(id)=>api.get(`/reviewer/${id}/timeslots`);

//Bookings

export const bookings = (bookingdetails)=>api.post('/booking',bookingdetails);

export const getbookings = (id)=> api.get(`/reviewer/${id}/bookings`);

export default api;