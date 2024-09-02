import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { MdAccessTime, MdBook, MdCode, MdDateRange, MdEmail } from 'react-icons/md';
import { IoMdPeople } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookings, getstudentsbyadvisor, setstaffAuthToken, timeslot } from '../../../api/staff_api';
import { getIdFromToken } from '../../../services/authService';

const formatTime = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const ReviewsTime = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    const id = await getIdFromToken();
    try {
      const response = await getstudentsbyadvisor(id);
      setStudents(response?.data);
    } catch (error) {
      console.log("fetch error", error);
    }
  };

  const fetchTimeslots = async () => {
    try {
      const response = await timeslot();
      setAvailableTimes(response.data);
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setstaffAuthToken(token);
      fetchTimeslots();
      fetchStudents();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleOpenModal = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedStudent(null); 
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId === selectedStudent ? null : studentId);
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error("Please select a student.");
      return;
    }
    try {
      const advisorId = await getIdFromToken();
      if (!advisorId) {
        throw new Error('Advisor ID not found');
      }
      const response = await bookings(advisorId, selectedStudent, selectedSlot._id);
      toast.success(response.data.message);
      fetchTimeslots();
    } catch (error) {
      console.error('Booking failed:', error.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
    handleCloseModal();
  };

  return (
    <div className="container mx-auto p-4 w-full h-[89vh] overflow-auto">
      <div className="rounded-lg p-1">
        {availableTimes.map((slot) => (
          <div
            key={slot._id}
            className="flex flex-col sm:flex-row justify-between items-start mb-5 p-3 border border-gray-200 bg-white shadow-md rounded-md transition-transform transform hover:bg-gray-100"
          >
            <div className="flex-1">
              <div className="font-medium text-lg sm:text-xl flex items-center">
                <MdDateRange className="mr-2" />
                {slot.date} at
                <MdAccessTime className="ml-2 mr-2" />
                {formatTime(slot.time)}
              </div>
              <div className={`text-sm mt-1 ${slot.available ? 'text-green-600' : 'text-red-600'}`}>
                {slot.available ? 'Available' : 'Not Available'}
              </div>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Description:</span> {slot.description || 'No description available'}
              </p>
              {slot.reviewer && (
                <div className="mt-4">
                  <p className="text-gray-800 font-medium flex items-center">
                    <IoMdPeople className="mr-2 text-gray-600 hover:text-blue-500 transition-colors" />
                    Reviewer Details:
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <MdEmail className="mr-2 text-gray-600 hover:text-blue-500 transition-colors" />
                    Email: {slot.reviewer.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <MdCode className="mr-2 text-gray-600 hover:text-blue-500 transition-colors" />
                    Stack: {slot.reviewer.stack}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleOpenModal(slot)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors"
            >
              <MdBook size={20} className="mr-2 text-white hover:text-yellow-300 transition-colors" />
              Book
            </button>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <DialogPanel className="relative w-full bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-medium mb-4">Select a Student for Booking</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Select</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stack</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Week</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((item) => (
                      <tr
                        key={item._id}
                        className={`hover:bg-gray-100 cursor-pointer ${selectedStudent === item._id ? 'bg-gray-200' : ''}`}
                        onClick={() => handleStudentSelect(item._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <input
                            type="radio"
                            checked={selectedStudent === item._id}
                            readOnly
                            className="form-radio"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.batch}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stack}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.week}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={handleCloseModal}
                  className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ReviewsTime;
