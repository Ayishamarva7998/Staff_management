import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMail, FiUsers, FiLayers, FiClipboard, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';
import { getbookings, setAuthToken } from '../../../api/staff_api';
import { getIdFromToken } from '../../../services/authService';

const initialBookings = [
  { id: 1, date: '2024-08-10', time: '10:00 AM', studentEmail: 'student1@example.com', week: 'Week 1', stack: 'Frontend' },
  { id: 2, date: '2024-08-10', time: '11:00 AM', studentEmail: 'student2@example.com', week: 'Week 1', stack: 'Backend' },
  { id: 3, date: '2024-08-11', time: '02:00 PM', studentEmail: 'student3@example.com', week: 'Week 2', stack: 'Full Stack' },
  { id: 4, date: '2024-08-12', time: '03:00 PM', studentEmail: 'student4@example.com', week: 'Week 2', stack: 'Frontend' },
  { id: 5, date: '2024-08-12', time: '04:00 PM', studentEmail: 'student5@example.com', week: 'Week 3', stack: 'Backend' },
  { id: 6, date: '2024-08-13', time: '09:00 AM', studentEmail: 'student6@example.com', week: 'Week 3', stack: 'Full Stack' },
  { id: 7, date: '2024-08-14', time: '10:00 AM', studentEmail: 'student7@example.com', week: 'Week 4', stack: 'Frontend' },
  { id: 8, date: '2024-08-14', time: '11:00 AM', studentEmail: 'student8@example.com', week: 'Week 4', stack: 'Backend' },
  // Add more dummy data as needed
];

const rowsPerPage = 5;

const BookingTime = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const filteredBookings = selectedDate 
  ? bookings.filter(booking => {
      return booking.timeslot.date === selectedDate;
    })
  : bookings;

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDialog = () => {
    setSelectedBooking(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const fetchBookings = async ()=>{
   try {
    const id = getIdFromToken();
    const response = await getbookings(id);
    console.log(response.data);
    
    setBookings(response?.data)
   } catch (error) {
    console.log('error ferching',error);    
   }
  }
  const nav =useNavigate();
  useEffect(() => {
    const token= localStorage.getItem('token');
    if(token){
      setAuthToken(); 
      fetchBookings();
   }else{
     nav('/'); 
   }
   }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-4 py-2 border rounded-md"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Week</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stack</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.timeslot?.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.timeslot?.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.week}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.stack}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                  <button
                    onClick={() => handleBookingClick(booking)}
                    className="hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end gap-2 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            <IoMdArrowBack size={24} />
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page + 1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-gray-300`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            <IoMdArrowForward size={24} />
          </button>
        </div>
      )}

      {selectedBooking && (
          <Dialog open={true} onClose={closeDialog} className="relative z-10">
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                  Booking Details
                </DialogTitle>
                <button onClick={closeDialog} className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-4 text-gray-700">
                {/* Time and Date at the Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className="mr-3 text-gray-500" />
                    <strong>Booking Time:</strong>
                  </div>
                  <span>{selectedBooking?.timeslot?.time || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiCalendar className="mr-3 text-gray-500" />
                    <strong>Booking Date:</strong>
                  </div>
                  <span>{selectedBooking?.timeslot?.date || 'N/A'}</span>
                </div>
    
                {/* Information Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiMail className="mr-3 text-gray-500" />
                    <strong>Student Email:</strong>
                  </div>
                  <span className='break-all'>{selectedBooking?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiMail className="mr-3 text-gray-500" />
                    <strong>Advisor Email:</strong>
                  </div>
                  <span>{selectedBooking?.advisor?.email || 'N/A'}</span>
                </div>
    
                {/* Additional Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUsers className="mr-3 text-gray-500" />
                    <strong>Batch:</strong>
                  </div>
                  <span>{selectedBooking?.batch || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiLayers className="mr-3 text-gray-500" />
                    <strong>Stack:</strong>
                  </div>
                  <span>{selectedBooking?.stack || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClipboard className="mr-3 text-gray-500" />
                    <strong>Week:</strong>
                  </div>
                  <span>{selectedBooking?.week || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiInfo className="mr-3 text-gray-500" />
                    <strong>Description:</strong>
                  </div>
                  <span>{selectedBooking?.timeslot?.description || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiCheckCircle className="mr-3 text-gray-500" />
                    <strong>Booked:</strong>
                  </div>
                  <span>{selectedBooking?.created_at ? new Date(selectedBooking.created_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FiX className="mr-2" />
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default BookingTime;
