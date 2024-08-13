import React, { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addStaff, setAuthToken } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    batch: "",
    stack: "",
    hire: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().required("Role is required"),
    batch: Yup.string().when("role", {
      is: "advisor",
      then: (schema) => schema.required("Batch is required for advisors"),
      otherwise: (schema) => schema.notRequired(),
    }),
    stack: Yup.string().when("role", {
      is: "reviewer",
      then: (schema) => schema.required("Stack is required for reviewers"),
      otherwise: (schema) => schema.notRequired(),
    }),
    hire: Yup.string().when("role", {
      is: "reviewer",
      then: (schema) => schema.required("Review cash is required for reviewers"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true); // Start loading
    try {
      const response = await addStaff(values);
      toast.success(response.data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding staff:", error.response.data.message);
    } finally {
      setLoading(false); // Stop loading
      setSubmitting(false);
    }
  };

  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken();
    } else {
      nav("/");
    }
  }, [nav]);

  return (
    <div className=" bg-gray-100 w-full h-[89vh] overflow-auto p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Register Staff</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, handleChange }) => (
          <Form className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Phone Number
                </label>
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    handleChange(e);
                    setRole(e.target.value);
                  }}
                >
                  <option value="" label="Select role" />
                  <option value="advisor" label="Advisor" />
                  <option value="reviewer" label="Reviewer" />
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
            </div>

            {values.role === "advisor" && (
              <div className="mb-4">
                <label
                  htmlFor="batch"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Batch
                </label>
                <Field
                  as="select"
                  id="batch"
                  name="batch"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" label="Select batch" />
                  <option value="batch1" label="Batch 1" />
                  <option value="batch2" label="Batch 2" />
                </Field>
                <ErrorMessage
                  name="batch"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
            )}

            {values.role === "reviewer" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="stack"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Stack
                  </label>
                  <Field
                    as="select"
                    id="stack"
                    name="stack"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" label="Select stack" />
                    <option value="stack1" label="Stack 1" />
                    <option value="stack2" label="Stack 2" />
                  </Field>
                  <ErrorMessage
                    name="stack"
                    component="div"
                    className="text-red-500 text-xs mt-2"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="hire"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Review Cash
                  </label>
                  <Field
                    type="text"
                    id="hire"
                    name="hire"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="hire"
                    component="div"
                    className="text-red-500 text-xs mt-2"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || loading}
            >
              {loading ? <RingLoader color="#fff" size={24} /> : "Register Staff"}
            </button>
          </Form>
        )}
      </Formik>
      </div>
    </div>
  );
};

export default AddStaff;
