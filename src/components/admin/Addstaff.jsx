import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addStaff, setAuthToken } from '../../utils/api';
import toast from 'react-hot-toast';

const AddStaff = () => {
  const [role, setRole] = useState('');

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    batch: '',
    stack: '',
    reviewCash: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Invalid phone number')
      .required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string().required('Role is required'),
    batch: Yup.string().when('role', {
      is: 'advisor',
      then: (schema) => schema.required('Batch is required for advisors'),
      otherwise: (schema) => schema.notRequired(),
    }),
    stack: Yup.string().when('role', {
      is: 'reviewer',
      then: (schema) => schema.required('Stack is required for reviewers'),
      otherwise: (schema) => schema.notRequired(),
    }),
    reviewCash: Yup.string().when('role', {
      is: 'reviewer',
      then: (schema) => schema.required('Review cash is required for reviewers'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addStaff({
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role: values.role,
        batch: values.batch,
        stack: values.stack,
        reviewCash: values.reviewCash,
      });
      toast.success('Staff added successfully')
      resetForm();
    } catch (error) {
      toast.error('Error');
      console.error('Error adding staff:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken();
    } else {
      nav('/');
    }
  }, []);

  return (
    <div className="w-[90%] h-[85vh] overflow-auto">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form className="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-2" />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <Field
                type="text"
                id="phone"
                name="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-2" />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-2" />
            </div>

            <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <Field
                as="select"
                id="role"
                name="role"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => {
                  handleChange(e);
                  setRole(e.target.value);
                }}
              >
                <option value="" label="Select role" />
                <option value="advisor" label="Advisor" />
                <option value="reviewer" label="Reviewer" />
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-2" />
            </div>
          </div>

          {values.role === 'advisor' && (
            <div className="mb-4">
              <label htmlFor="batch" className="block text-gray-700 text-sm font-bold mb-2">
                Batch
              </label>
              <Field
                as="select"
                id="batch"
                name="batch"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" label="Select batch" />
                <option value="batch1" label="Batch 1" />
                <option value="batch2" label="Batch 2" />
                <option value="batch3" label="Batch 3" />
                <option value="batch4" label="Batch 4" />
              </Field>
              <ErrorMessage name="batch" component="div" className="text-red-500 text-xs mt-2" />
            </div>
          )}

          {values.role === 'reviewer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stack" className="block text-gray-700 text-sm font-bold mb-2">
                  Stack
                </label>
                <Field
                  as="select"
                  id="stack"
                  name="stack"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" label="Select stack" />
                  <option value="Python" label="Python" />
                  <option value="Flutter" label="Flutter" />
                  <option value="React.js" label="React.js" />
                  <option value="Mern" label="Mern" />
                  <option value=".NET" label=".NET" />
                  <option value="Mean" label="Mean" />
                </Field>
                <ErrorMessage name="stack" component="div" className="text-red-500 text-xs mt-2" />
              </div>

              <div>
                <label htmlFor="reviewCash" className="block text-gray-700 text-sm font-bold mb-2">
                  Review Cash
                </label>
                <Field
                  type="text"
                  id="reviewCash"
                  name="reviewCash"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage name="reviewCash" component="div" className="text-red-500 text-xs mt-2" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Staff
            </button>
          </div>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default AddStaff;
