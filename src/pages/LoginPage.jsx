import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { login, setAuthToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  position: Yup.string()
    .oneOf(["admin", "advisor", "reviewer"], "Invalid position")
    .required("Position is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
        role: values.position,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("worker_id", response.data._id);
      setAuthToken(token);
      console.log("Login successful:", response.data);
      toast.success("Login successful");
      if(values.position=== 'admin'){
        navigate("/admin/inbox");
      }else if(values.position=== 'advisor'){
        navigate("/advisor/inbox");        
      }else if(values.position === 'reviewer'){
        navigate("/reviewer/inbox");   
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="hidden md:block md:w-1/2 h-full bg-cover bg-center border-[5px] rounded-2xl"
        style={{
          backgroundImage:
            "url('https://www.kerojetservices.com/wp-content/uploads/2021/09/staff-management.jpeg')",
        }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
          <div className="text-center text-white p-8">
            <p className="text-lg font-semibold mb-4">
              Bridgeon Solutions uses this website for efficient staff
              management and seamless operations.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center md:hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUsj969OxAXIdz0f33l_yF02ZyMY5aLHclIA&s"
              alt="Brand Logo"
              className="mx-auto h-36 w-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-center">Log In</h2>
          <Formik
            initialValues={{ email: "", password: "", position: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Position
                  </label>
                  <Field
                    as="select"
                    name="position"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="" label="Select position" />
                    <option value="admin" label="Admin" />
                    <option value="advisor" label="Advisor" />
                    <option value="reviewer" label="Reviewer" />
                  </Field>
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-2 bg-blue-500 text-white rounded-md"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="text-end mt-4">
            <a href="#" className="text-sm text-blue-600">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
