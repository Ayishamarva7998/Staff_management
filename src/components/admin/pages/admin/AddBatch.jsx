import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { MdClose } from 'react-icons/md'; 
import { RingLoader } from 'react-spinners'; 
import { addbatch, setAdminAuth } from '../../../../api/admin_api';
import { getIdFromToken } from '../../../../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  batches: Yup.number()
    .required('Batches are required')
    .min(1, 'Batches must be at least 1')
    .max(999, 'Batches must not exceed 999') 
    .integer('Batches must be an integer') 
});

const AddBatch = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      batches: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const id = getIdFromToken();
        const response = await addbatch(id,values); 
        toast.success(response?.data?.message);
      } catch (error) {
        console.error(error); 
      } finally {
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
            Add New Batches
          </Dialog.Title>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="batches" className="block text-gray-700">
                Batches
              </label>
              <input
                id="batches"
                name="batches"
                type="number" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.batches}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.batches && formik.errors.batches ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.batches}</div>
              ) : null}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? <RingLoader size={24} color="#ffffff" /> : 'Add Batches'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddBatch;
