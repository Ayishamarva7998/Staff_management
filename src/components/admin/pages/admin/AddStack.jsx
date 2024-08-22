import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { MdClose } from 'react-icons/md'; 
import { RingLoader } from 'react-spinners'; 
import { getIdFromToken } from '../../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { addstack, setAdminAuth } from '../../../../api/admin_api';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  stack: Yup.string()
    .required('Stack is required')
    .min(1, 'Stack must be at least 2 characters long')
    .max(50, 'Stack must not exceed 50 characters')
});

const AddStack = ({ isOpen, onClose }) => {
  const [loading, setLoading] =  useState(false);

  const formik = useFormik({
    initialValues: {
      stack: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {      
      setLoading(true);

      try {
        const id =await getIdFromToken();
        const response = await addstack(id,values);
        toast.success(response?.data?.message);      
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
        resetForm();
        onClose();
      }
    }
  });


  const nav=useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      setAdminAuth();
    } else {
      nav("/");
    }
  })
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg relative">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose className="h-6 w-6" aria-hidden="true" />
          </button>
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Add New Stack
          </Dialog.Title>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="stack" className="block text-gray-700">
                Stack
              </label>
              <input
                id="stack"
                name="stack"
                type="text" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.stack}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.stack && formik.errors.stack ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.stack}</div>
              ) : null}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? <RingLoader size={24} color="#ffffff" /> : 'Add Stack'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddStack;
