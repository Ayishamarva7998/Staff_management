import React, { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import { addStaff, setAuthToken } from "../../../../api/admin_api";


const AddStaff = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStacks, setSelecteStacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalstack, setIsModalstack] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    batches: [],
    stacks: [],
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
  });
  

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true); 

    const finalValues = { ...values, batches: selectedBatches.map(batch => batch.value),stacks:selectedStacks.map(stack => stack.value) };    


    console.log(finalValues,'hy im suhab');
    
    
    try {
      const response = await addStaff(finalValues);    
      console.log(response.data);
        
      toast.success(response.data.message);
      setSelectedBatches([]);
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


  const batchOptions = [
    { value: "1", label: "Batch 1" },
    { value: "2", label: "Batch 2" },
    { value: "3", label: "Batch 3" },
    { value: "4", label: "Batch 4" },
    { value: "5", label: "Batch 5" },
    { value: "6", label: "Batch 6" },
    { value: "7", label: "Batch 7" },
    { value: "8", label: "Batch 8" }
  ];
  const stackOption = [
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "Html", label: "Html" },
    { value: "Css", label: "Css" },
  ];


  return (<>
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
                <div className="mb-4"  id="batches"
                name="batches">
                  <label
                    htmlFor="batches"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Batches
                  </label>
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Batch
                  </button>
                  <div className="mt-2"   id="batches"
                    name="batches">
                    {selectedBatches.map((batch) => (
                      <span
                        key={batch.value}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                      >
                        {batch.label}
                      </span>
                    ))}
                  </div>
                  <ErrorMessage
                    name="batches"
                    component="div"
                    className="text-red-500 text-xs mt-2"
                  />
                </div>
              )}
              
            {values.role === "reviewer" && ( <>
                <div className="mb-4"  id="stacks"
                name="stacks">
                  <label
                    htmlFor="stacks"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Stacks
                  </label>
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={() => setIsModalstack(true)}
                  >
                    Add Stack
                  </button>
                  <div className="mt-2"   id="stacks"
                    name="stacks">
                    {selectedStacks.map((stack) => (
                      <span
                        key={stack.value}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                      >
                        {stack.label}
                      </span>
                    ))}
                  </div>
                  <ErrorMessage
                    name="stacks"
                    component="div"
                    className="text-red-500 text-xs mt-2"
                  />
                </div>
               
                {/* <div className="mb-4">
                  <label
                    htmlFor="stacks"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Stacks
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
                </div> */}

                <div className="mb-4">
                  <label
                    htmlFor="hire"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Hire Cash
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

            {/* {values.role === "reviewer" && (
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
            )} */}

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


    <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Select Batches
          </Dialog.Title>
          <Select
            isMulti
            options={batchOptions}
            value={selectedBatches}
            onChange={setSelectedBatches}
            className="mb-4"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>






      <Dialog
        open={isModalstack}
        onClose={() => setIsModalstack(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Select Stacks
          </Dialog.Title>
          <Select
            isMulti
            options={stackOption}
            value={selectedStacks}
            onChange={setSelecteStacks}
            className="mb-4"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalstack(false)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddStaff;
