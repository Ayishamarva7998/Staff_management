import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:4500/api',
});

// Function to set the authorization token
export const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = ` ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// API call for login
export const login = (credentials) => api.post('/login', credentials);

// API call to create an admin
export const createAdmin = (adminData) => api.post('/adds', adminData);

// API call to update admin password
export const updateAdminPassword = (adminId, passwordData) => api.put(`/${adminId}`, passwordData);

// API call to add a staff member
export const addStaff = (staffData) => api.post('/admin/staff', staffData);

// API call to update staff details
export const updateStaff = (staffId, staffData) => api.patch(`/${staffId}`, staffData);

// API call to view advisors
export const viewAdvisors = () => api.get('/admin/advisor');

// API call to view reviewers
export const viewReviewers = () => api.get('/admin/reviewer');

// API call to delete an advisor
export const deleteAdvisor = (advisorId) => api.delete(`/advisor/${advisorId}`);

// API call to search staff
export const searchStaff = (query) => api.get(`/search`, { params: { query } });

// API call to process payment for a reviewer
export const processPayment = (paymentId, paymentData) => api.post(`/payment/${paymentId}`, paymentData);

// API call to create group meetings
export const createMeeting = (meetingData) => api.post('/admin/meetings', meetingData);

//get all staffs 
export const getallstaffs = ()=>api.get('/admin/staffs');






// timeslot 

export const timeslot = ()=>api.get('/staff/timeslots');

export const createtimeslot =(cratedata)=>api.post('/staff/createtimeslot',cratedata);

export const updatetimeslot =(id, updatedata)=>api.put(`/staff/updatetimeslot/${id}`,updatedata);

export const deleteTimeslot = (id) => api.delete(`/staff/deletetimeslot/${id}`);

export const getreviewertimeslots =(id)=>api.get(`/staff/reviewer/${id}/timeslots`);

//Bookings

export const bookings = (bookingdetails)=>api.post('/staff/booking',bookingdetails);

export const getbookings = (id)=> api.get(`/staff/reviewer/${id}/bookings`)

export default api;
