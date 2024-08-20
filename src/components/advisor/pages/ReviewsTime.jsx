import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { MdAccessTime, MdBook, MdCode, MdDateRange, MdEmail } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { IoMdPeople } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookings, setAuthToken, timeslot } from '../../../api/staff_api';
import { getIdFromToken } from '../../../services/authService';

// Timeslot data
const timeslots = [
  { id: 1, date: '2024-08-10', time: '09:00 AM', available: true, description: 'Morning slot available.' },
  { id: 2, date: '2024-08-10', time: '10:00 AM', available: true, description: 'Late morning slot available.' },
  { id: 3, date: '2024-08-11', time: '01:00 PM', available: false, description: 'Lunch time, slot unavailable.' },
  { id: 4, date: '2024-08-12', time: '02:00 PM', available: true, description: 'Afternoon slot available.' },
];

// Convert 24-hour time to 12-hour format
const formatTime = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Sample options for dropdowns
const batchOptions = ['Batch 1', 'Batch 2', 'Batch 3'];
const stackOptions = ['Stack 1', 'Stack 2', 'Stack 3'];
const weekOptions = ['Week 1', 'Week 2', 'Week 3'];

// Validation schema for Formik
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  batch: Yup.string().oneOf(batchOptions, 'Invalid batch').required('Batch is required'),
  stack: Yup.string().oneOf(stackOptions, 'Invalid stack').required('Stack is required'),
  week: Yup.string().oneOf(weekOptions, 'Invalid week').required('Week is required'),
  description: Yup.string(),
});

const ReviewsTime = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchTimeslots();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchTimeslots = async () => {
    try {
      const response = await timeslot();
      setAvailableTimes(response.data);
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  };

  const handleOpenModal = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleSubmit = async (values) => {
    try {
      // const advisorId = localStorage.getItem('worker_id');
const advisorId=getIdFromToken();
console.log(advisorId,"id");
    
    if (!advisorId) {
      throw new Error('Advisor ID not found');
    }
      const response = await bookings({advisorId:advisorId, timeslotId: selectedSlot._id, reviewerId: selectedSlot.reviewer ? selectedSlot.reviewer._id : null, email:values.email, batch:values.batch, stack:values.stack, week:values.week, comments:values.comments});
      console.log(response.data,"errorsss");
      toast.success(response.data.message);
      fetchTimeslots();
    } catch (error) {
      console.error('Booking failed:', error.response.data.message);
      toast.error(error.response.message)
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

      {/* Booking Modal */}
      {selectedSlot && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <DialogPanel className="relative max-w-sm w-full bg-white p-6 rounded-lg shadow-xl">
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Booking Details
              </DialogTitle>
              <Formik
                initialValues={{ email: '', batch: '', stack: '', week: '', description: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ resetForm }) => (
                  <Form className="mt-2">
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Student Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="px-4 py-2 border rounded-md w-full"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Field
                        type="text"
                        id="description"
                        name="description"
                        className="px-4 py-2 border rounded-md w-full"
                      />
                      <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                        Batch
                      </label>
                      <Field as="select" id="batch" name="batch" className="px-4 py-2 border rounded-md w-full">
                        <option value="" label="Select batch" />
                        {batchOptions.map((option) => (
                          <option key={option} value={option} label={option} />
                        ))}
                      </Field>
                      <ErrorMessage name="batch" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="stack" className="block text-sm font-medium text-gray-700">
                        Stack
                      </label>
                      <Field as="select" id="stack" name="stack" className="px-4 py-2 border rounded-md w-full">
                        <option value="" label="Select stack" />
                        {stackOptions.map((option) => (
                          <option key={option} value={option} label={option} />
                        ))}
                      </Field>
                      <ErrorMessage name="stack" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="week" className="block text-sm font-medium text-gray-700">
                        Week
                      </label>
                      <Field as="select" id="week" name="week" className="px-4 py-2 border rounded-md w-full">
                        <option value="" label="Select week" />
                        {weekOptions.map((option) => (
                          <option key={option} value={option} label={option} />
                        ))}
                      </Field>
                      <ErrorMessage name="week" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Confirm Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseModal();
                          resetForm();
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ReviewsTime;
