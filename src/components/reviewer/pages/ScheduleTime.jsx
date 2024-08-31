import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { LuFileEdit } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createtimeslot, deleteTimeslot, getreviewertimeslots, setstaffAuthToken, updatetimeslot } from '../../../api/staff_api';
import { getIdFromToken } from '../../../services/authService';


const rowsPerPage = 5;

const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  description: Yup.string().required('Description is required'),
});

const ScheduleTime = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [editingTime, setEditingTime] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  

  const fetchtime = async ()=>{
    try {
      const id = getIdFromToken();
      
      const response = await getreviewertimeslots(id);     
      setAvailableTimes(response.data);      
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  }

  const nav =useNavigate();
  useEffect(() => {
    const token= localStorage.getItem('token');
    if(token){
      setstaffAuthToken(); 
      fetchtime();
   }else{
     nav('/'); 
   }
   }, []);


   const handleAddTime = async (values, { resetForm }) => {
    try {
      const id = getIdFromToken(); 
      if (!id) {
        throw new Error('User ID not found in local storage');
      }
      const response = await createtimeslot({ date:values.date, time:values.time, reviewer:id, description:values.description });
      toast.success(response.data.message)
      fetchtime();
      resetForm();
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };


  const handleEditTime = (time) => {  
    setEditingTime(time);
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await updatetimeslot(editingTime._id,values);
      toast.success(response.data.message);
      fetchtime();
    } catch (error) {
      console.log('error updating', error);      
    }    
    setEditingTime(null);
  };

  const handleRemoveTime = async(id) => {
    try {
      const response = await deleteTimeslot(id);
      toast.error(response.data.message);
      fetchtime();
    } catch (error) {
      
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(availableTimes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTimes = availableTimes.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="container mx-auto p-4">
      <Formik
        initialValues={{ date: '', time: '', description: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddTime}
      >
        {({ resetForm }) => (
          <Form className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <Field
                type="date"
                name="date"
                className="px-4 py-2 border rounded-md w-full"
              />
              <ErrorMessage name="date" component="div" className="text-red-600 text-sm" />
            </div>
            <div className="flex-1">
              <Field
                type="time"
                name="time"
                className="px-4 py-2 border rounded-md w-full"
              />
              <ErrorMessage name="time" component="div" className="text-red-600 text-sm" />
            </div>
            <div className="flex-1">
              <Field
                type="text"
                name="description"
                placeholder="Description"
                className="px-4 py-2 border rounded-md w-full"
              />
              <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-1"
            >
              Add Time
            </button>
          </Form>
        )}
      </Formik>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTimes.map((time) => (
              <tr key={time._id} className="hover:bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {new Date(time.date).toLocaleDateString('en-GB')}
</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{time.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {time.available ? 'Available' : 'Booked'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{time.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEditTime(time)}
                    className="px-1 py-2 rounded-md hover:bg-slate-200"
                  >                    
                  <LuFileEdit size={20}/>
                  </button>
                  <button
                    onClick={() => handleRemoveTime(time._id)}
                    className="px-1 py-2 rounded-md hover:bg-slate-200 ml-2"
                  >
                    <MdDelete size={20} />
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

      {editingTime && (
        <Formik
          initialValues={{ date: editingTime.date, time: editingTime.time, description: editingTime.description }}
          validationSchema={validationSchema}
          onSubmit={handleSaveEdit}
        >
          {({ resetForm }) => (
           <Dialog open={true} onClose={() => { setEditingTime(null); resetForm(); }} className="relative z-10">
           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
           <div className="fixed inset-0 z-10 flex items-center justify-center p-4 text-center sm:p-0">
             <DialogPanel className="relative max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
               <DialogTitle as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                 Edit Time Slot
               </DialogTitle>
               <Form className="space-y-4">
                 <div className="space-y-1">
                   <Field
                     type="date"
                     name="date"
                     className="block px-4 py-2 border rounded-md w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <ErrorMessage name="date" component="div" className="text-red-600 text-sm mt-1" />
                 </div>
                 <div className="space-y-1">
                   <Field
                     type="time"
                     name="time"
                     className="block px-4 py-2 border rounded-md w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <ErrorMessage name="time" component="div" className="text-red-600 text-sm mt-1" />
                 </div>
                 <div className="space-y-1">
                   <Field
                     type="text"
                     name="description"
                     placeholder="Description"
                     className="block px-4 py-2 border rounded-md w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                 </div>
                 <div className="flex justify-end gap-3 mt-4">
                   <button
                     type="button"
                     onClick={() => { setEditingTime(null); resetForm(); }}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                   >
                     Save
                   </button>
                 </div>
               </Form>
             </DialogPanel>
           </div>
         </Dialog>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ScheduleTime;
