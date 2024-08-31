import React, { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import { addstudent, setstaffAuthToken } from "../../../../api/staff_api";
import { getIdFromToken } from "../../../../services/authService";

const formatOptions = (data) =>
  data.map((item) => ({ label: item, value: item }));

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [stackOptions, setStackOptions] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchData = ["Batch 1", "Batch 2", "Batch 3"];
        const stackData = ["React", "Node.js", "Python"];
        const weekData = ["Week 1", "Week 2", "Week 3"];

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setBatchOptions(formatOptions(batchData));
        setStackOptions(formatOptions(stackData));
        setWeekOptions(formatOptions(weekData));
      } catch (error) {
        toast.error("Error fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    batch: "",
    stack: "",
    week: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    batch: Yup.string().required("Batch is required"),
    stack: Yup.string().required("Stack is required"),
    week: Yup.string().required("Week is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);

    setstaffAuthToken();
    const id = getIdFromToken();

    try {
      const response = await addstudent(id, values);
      toast.success(response.data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 w-full h-[89vh] overflow-auto p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Register Student</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
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
                    className="text-red-600 text-sm mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
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
                    className="text-red-600 text-sm mt-2"
                  />
                </div>
              </div>

              {/* Phone and Batch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
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
                    className="text-red-600 text-sm mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="batch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Batch
                  </label>
                  <Select
                    id="batch"
                    name="batch"
                    options={batchOptions}
                    onChange={(option) =>
                      setFieldValue("batch", option ? option.value : "")
                    }
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                  />
                  <ErrorMessage
                    name="batch"
                    component="div"
                    className="text-red-600 text-sm mt-2"
                  />
                </div>
              </div>

              {/* Stack and Week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="stack"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stack
                  </label>
                  <Select
                    id="stack"
                    name="stack"
                    options={stackOptions}
                    onChange={(option) =>
                      setFieldValue("stack", option ? option.value : "")
                    }
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                  />
                  <ErrorMessage
                    name="stack"
                    component="div"
                    className="text-red-600 text-sm mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="week"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Week
                  </label>
                  <Select
                    id="week"
                    name="week"
                    options={weekOptions}
                    onChange={(option) =>
                      setFieldValue("week", option ? option.value : "")
                    }
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                  />
                  <ErrorMessage
                    name="week"
                    component="div"
                    className="text-red-600 text-sm mt-2"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? <RingLoader color="#fff" size={24} /> : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddStudent;
