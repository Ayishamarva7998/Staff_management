'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createMeeting, getallstaffs, setAdminAuth } from '../../../../api/admin_api';

const Meeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [staffList, setStaffList] = useState([]);



  const [searchQuery, setSearchQuery] = useState('');

  // Filter staff list based on search query
  const filteredStaffList = staffList?.filter(staff =>
    staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initialValues = {
    title: '',
    date: '',
    time: '',
    meetingtype: '',
    participants: [],
    description: '',
    meetingLink: '',
    location: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Meeting title is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    meetingtype: Yup.string().required('Meetingtype is required'),
    description: Yup.string().required('Description is required'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createMeeting({title:values.title,date:values.date,time:values.time,participants:selectedStaff,meetingtype:values.meetingtype,description:values.description});
  
      if (!response) {
        throw new Error('Network response was not ok');
      };

      toast.success(response?.data?.message);    

      resetForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error:')
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSelectAll = (checked) => {
    if (checked) {
      const allStaffEmails = staffList.map((staff) => staff.email);
      setSelectedStaff(allStaffEmails);
    } else {
      setSelectedStaff([]);
    }
    setSelectAll(checked);
  };

  const handleStaffChange = (email, checked) => {
    if (checked) {
      setSelectedStaff((prevSelected) => [...prevSelected, email]);
    } else {
      setSelectedStaff((prevSelected) => prevSelected.filter((e) => e !== email));
    }
    setSelectAll(staffList.length === selectedStaff.length + 1);
  };

  const fetchStaffs = async () => {
    try {
      const response = await getallstaffs();
      if (response) {
        setStaffList(response?.data?.staffs);
      } else {
        setStaffList([]);
      }
    } catch (error) {
      console.error(error);
      setStaffList([]);
    }
  };
  const nav=useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAdminAuth();
      fetchStaffs();
    } else {
      nav('/');
    }
  }, []);

  return (
    <div className="bg-gray-100 w-full h-[89vh] overflow-auto p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Meeting Schedule</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Meeting Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-2" />
                </div>

                <div>
                  <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-xs mt-2" />
                </div>

                <div>
                  <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
                    Time
                  </label>
                  <Field
                    type="time"
                    id="time"
                    name="time"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="time" component="div" className="text-red-500 text-xs mt-2" />
                </div>
                <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Meeting Type
              </label>
              <Field
                as="select"
                type="text"
                    id="meetingtype"
                    name="meetingtype"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" label="Select type" />
                <option value="offline" label="offline" />
                <option value="online" label="online" />
              </Field>
              <ErrorMessage name="Meeting Type" component="div" className="text-red-500 text-xs mt-2" />
            </div>

              </div>

              <div className="mb-6">
                <label htmlFor="participants" className="block text-gray-700 text-sm font-bold mb-2">
                  Participants
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-2 border border-gray-300 rounded bg-blue-500 text-white"
                >
                  Select Staff
                </button>
                <div className="mt-2">
                {selectedStaff.length > 0 ? (
  <ul className="list-disc pl-5">
    {selectedStaff.map((email, index) => (
      <li key={index} className="break-all">{email}</li>
    ))}
  </ul>
) : (
  <p>No staff selected</p>
)}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-2" />
              </div>
              

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Meeting
                </button>
              </div>
            </Form>
          )}
        </Formik>

        

        {/* Staff Select Modal */}
        <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true" />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all sm:my-8">
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <PlusIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Add Staff Members
              </DialogTitle>
              <div className="mt-2">
                {/* Search Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4 h-[250px] overflow-auto">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="selectAll"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Select All
                    </label>
                  </div>
                  {filteredStaffList?.map((staff, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`staff-${index}`}
                        value={staff?.email}
                        checked={selectedStaff.includes(staff?.email)}
                        onChange={(e) =>
                          handleStaffChange(staff?.email, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`staff-${index}`}
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        {staff?.email}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Done
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>


      </div>
    </div>
  );
};

export default Meeting;
