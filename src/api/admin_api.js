import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:4500/api/admin',
});

export const setAdminAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = ` ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// API call to create an admin
export const createAdmin = (adminData) => api.post('/adds', adminData);


// API call to add a staff member
export const addStaff = (staffData) => api.post('/staff', staffData);

// API call to update staff details
// export const updateStaff = (staffId, staffData) => api.patch(`/${staffId}`, staffData);

// API call to view advisors
export const viewAdvisors = () => api.get('/advisor');

// API call to view reviewers
export const viewReviewers = () => api.get('/reviewer');

// API call to delete an advisor
// export const deleteAdvisor = (advisorId) => api.delete(`/advisor/${advisorId}`);

// API call to search staff
export const searchStaff = (query) => api.get(`/search`, { params: { query } });

// API call to process payment for a reviewer
export const processPayment = (paymentId, paymentData) => api.post(`/payment/${paymentId}`, paymentData);

// API call to create group meetings
export const createMeeting = (meetingData) => api.post('/meetings', meetingData);

//get all staffs 
export const getallstaffs = ()=>api.get('/staffs');





export const updatestaff = (id,values)=>api.patch(`/update/${id}`,values);
export const deletestaff = (id)=>api.delete(`/delete/${id}`);

export const addstack = (id,stack)=>api.post(`stack/${id}`,stack);
export const deletestack = (id,stack)=>api.delete(`stack/${id}`,{ params: { stack }});


export const addbatch = (id,batch)=>api.post(`batch/${id}`,batch);
export const deletebatch = (id,batch)=>api.delete(`batch/${id}`,{ params: { batch }});



