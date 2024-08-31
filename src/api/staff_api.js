import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:4500/api/staff',
});


export const setstaffAuthToken = () => {
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

export const allbookings = ()=>api.get('/allbooking');


export const acceptBooking = (id)=>api.post(`/acceptBooking/${id}`);

export const reviewcount = (reviewerId)=>api.post(`/reviewcount/${reviewerId}`);
// for  total reviews in reviewer page

export const totalreviews = (id)=>api.get(`/totalreviews/${id}`);




// student apis 


export const addstudent = (id,studentdata)=>api.post(`/student/${id}`,studentdata);
export const getstudentsbyadvisor = (id)=>api.get(`/student/${id}`);
export const updatestudentbyadvisor = ( advisorId, studentId ,updatedata)=>api.put(`/student/${advisorId}/${studentId}`,updatedata);
export const deletestudestudent =(advisorId, studentId )=>api.delete(`/student/${advisorId}/${studentId}`)

export default api;