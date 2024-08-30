import React, { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import { addStaff, setAdminAuth } from "../../../../api/admin_api";
import { getbatches, getstacks, setcommonToken } from "../../../../api/common_api";

const AddStaff = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalstack, setIsModalstack] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [stackOptions, setStackOptions] = useState([]);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    batches: [],
    stacks: [],
    hire: 100,
    position: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone number is required"),
      role: Yup.string().required("Role is required"),


      password: Yup.string().min(6, 'Password must be at least 6 characters').when("role", {
        is: "employee",
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required("Password is required"),
      }),
    confirmPassword: Yup.string()
      .when('role', {
        is: "employee",
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required("Password is required").oneOf([Yup.ref('password')], 'Passwords must match'),
      }),

    batches: Yup.array().of(
      Yup.string().when("role", {
        is: "advisor",
        then: (schema) => schema.required("Batch is required for advisors"),
        otherwise: (schema) => schema.notRequired(),
      })
    ),
    stacks:Yup.array().of(
      Yup.string().when("role", {
        is: "reviewer",
        then: (schema) => schema.required("Stack is required for reviewer"),
        otherwise: (schema) => schema.notRequired(),
      })
    ),
    hire: Yup.string().when("role", {
      is: "reviewer",
      then: (schema) => schema.required("Review cash is required for reviewers"),
      otherwise: (schema) => schema.notRequired(),
    }),
    position: Yup.string().when("role", {
      is: "employee",
      then: (schema) => schema.required("position is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    const finalValues = { ...values, batches: selectedBatches.map(batch => batch.value), stacks: selectedStacks.map(stack => stack.value) };

    try {
      const response = await addStaff(finalValues);
      toast.success(response.data.message);
      setSelectedBatches([]);
      setSelectedStacks([]);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error adding staff:", error.response.data.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const fetchOptions = async () => {
    setcommonToken();
    try {
      const [stacksResponse, batchesResponse] = await Promise.all([getstacks(), getbatches()]);
      const formatOptions = data => data.map(item => ({ label: item, value: item }));
      setStackOptions(formatOptions(stacksResponse.data));
      setBatchOptions(formatOptions(batchesResponse.data));
    } catch (error) {
      console.error('Error fetching data:', error);
      setStackOptions([]);
      setBatchOptions([]);
    }
  };

  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAdminAuth();
      fetchOptions();
    } else {
      nav("/");
    }
  }, [nav]);

  return (
    <>
      <div className="bg-gray-100 w-full h-[89vh] overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Register Staff</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, values, handleChange }) => (
              <Form className="w-full">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                    <Field type="text" id="name" name="name" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <Field type="email" id="email" name="email" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                </div>

                {/* Phone and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                    <Field type="text" id="phone" name="phone" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">Role</label>
                    <Field as="select" id="role" name="role" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => {
                      handleChange(e);
                      setRole(e.target.value);
                    }}>
                      <option value="" label="Select role" />
                      <option value="advisor" label="Advisor" />
                      <option value="reviewer" label="Reviewer" />
                      <option value="employee" label="Employee" />
                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                </div>

                {/* Password and Confirm Password */}
                {values.role !== "employee" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                      <Field type="password" id="password" name="password" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-2" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                      <Field type="password" id="confirmPassword" name="confirmPassword" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-2" />
                    </div>
                  </div>
                )}

                {/* Batches for Advisor */}
                {values.role === "advisor" && (
                  <div className="mb-4">
                    <label htmlFor="batches" className="block text-gray-700 text-sm font-semibold mb-2">Batches</label>
                    <button type="button" className="text-blue-500" onClick={() => setIsModalOpen(true)}>Add Batch</button>
                    <div className="mt-2">
                      {selectedBatches.map(batch => (
                        <span key={batch.value} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">{batch.label}</span>
                      ))}
                    </div>
                    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen p-4">
                        <Dialog.Panel className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                          <Dialog.Title className="text-lg font-bold mb-4">Select Batches</Dialog.Title>
                          <Select
                            isMulti
                            options={batchOptions}
                            onChange={setSelectedBatches}
                            value={selectedBatches}
                          />
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Close
                          </button>
                        </Dialog.Panel>
                      </div>
                    </Dialog>
                    <ErrorMessage name="batches" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                )}

                {/* Stacks for Reviewer */}
                {values.role === "reviewer" && (
                  <div className="mb-4">
                    <label htmlFor="stacks" className="block text-gray-700 text-sm font-semibold mb-2">Stacks</label>
                    <button type="button" className="text-blue-500" onClick={() => setIsModalstack(true)}>Add Stack</button>
                    <div className="mt-2">
                      {selectedStacks.map(stack => (
                        <span key={stack.value} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">{stack.label}</span>
                      ))}
                    </div>
                    <Dialog open={isModalstack} onClose={() => setIsModalstack(false)} className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen p-4">
                        <Dialog.Panel className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                          <Dialog.Title className="text-lg font-bold mb-4">Select Stacks</Dialog.Title>
                          <Select
                            isMulti
                            options={stackOptions}
                            onChange={setSelectedStacks}
                            value={selectedStacks}
                          />
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                            onClick={() => setIsModalstack(false)}
                          >
                            Close
                          </button>
                        </Dialog.Panel>
                      </div>
                    </Dialog>
                    <ErrorMessage name="stacks" component="div" className="text-red-500 text-xs mt-2" />
                  </div>
                )}

                {/* Position and Hire */}
                {(values.role === "employee" || values.role === "reviewer") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {values.role === "employee" && (
                      <div>
                        <label htmlFor="position" className="block text-gray-700 text-sm font-semibold mb-2">Position</label>
                        <Field type="text" id="position" name="position" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <ErrorMessage name="position" component="div" className="text-red-500 text-xs mt-2" />
                      </div>
                    )}
                    {values.role === "reviewer" && (
                      <div>
                        <label htmlFor="hire" className="block text-gray-700 text-sm font-semibold mb-2">Hire Cash</label>
                        <Field type="text" id="hire" name="hire" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <ErrorMessage name="hire" component="div" className="text-red-500 text-xs mt-2" />
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                  disabled={loading || isSubmitting}
                >
                  {loading ? <RingLoader color="#ffffff" size={24} /> : "Add Staff"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddStaff;
