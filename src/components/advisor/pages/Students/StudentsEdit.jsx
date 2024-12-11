import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import * as Yup from "yup";
import Select from "react-select";
import { deletestaff, updatestaff } from "../../../../api/admin_api";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { setcommonToken } from "../../../../api/common_api";
import { deletestudestudent, updatestudentbyadvisor } from "../../../../api/staff_api";
import { getIdFromToken } from "../../../../services/authService";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  batch: Yup.string().required("Batch is required"),
  stack: Yup.string().required("Stack is required"),
  week: Yup.string().required("Week is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
});

// Edit student modal component
const StudentsEdit = ({
    selecteStudents,
    setSelectedStudents,
    isEditModalOpen,
    closeEditModal

}) => {
  const [batchOptions, setBatchOptions] = useState([]);
  const [stackOptions, setStackOptions] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    batch: "",
    stack: "",
    week: "",
    phone: "",
  });

  // Dummy data for options
  const dummyBatchOptions = [
    { label: "Batch A", value: "Batch A" },
    { label: "Batch B", value: "Batch B" },
    { label: "Batch C", value: "Batch C" },
  ];

  const dummyStackOptions = [
    { label: "Stack 1", value: "Stack 1" },
    { label: "Stack 2", value: "Stack 2" },
    { label: "Stack 3", value: "Stack 3" },
  ];

  const dummyWeekOptions = [
    { label: "Week 1", value: "Week 1" },
    { label: "Week 2", value: "Week 2" },
    { label: "Week 3", value: "Week 3" },
  ];

  // Fetch options
  const fetchOptions = async () => {
    setcommonToken();
    // Simulate an API call with dummy data
    setBatchOptions(dummyBatchOptions);
    setStackOptions(dummyStackOptions);
    setWeekOptions(dummyWeekOptions);
  };

  // Handle form submission
  const handleSubmit = async (values) => {


    const advisorId= await getIdFromToken();
    try {
      const data = {
        name: values.name,
        phone: String(values.phone),
        batch: values.batch,
        stack: values.stack,
        week: values.week,
      };


      const response = await updatestudentbyadvisor(advisorId,selecteStudents._id, data);
      toast.success(response?.data?.message);
      setSelectedStudents(null);
    } catch (error) {
      console.error("handleSubmit", error);
      toast.error(error?.response?.data?.message);
    } finally {
      closeEditModal();
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    const advisorId= await getIdFromToken();
    try {
      const response = await deletestudestudent(advisorId,selecteStudents._id);
      toast.success(response.data.message);
      setSelectedStudents(null);
      closeEditModal();
    } catch (error) {
      console.error("handleDelete", error);
      toast.error("Failed to delete advisor");
    }
  };

  // Fetch options on component mount
  useEffect(() => {
    fetchOptions();
  }, []);

  // Set initial values based on selected advisor
  useEffect(() => {
    if (selecteStudents) {
      setInitialValues({
        name: selecteStudents.name || "",
        batch: selecteStudents.batch || "",
        stack: selecteStudents.stack || "",
        week: selecteStudents.week || "",
        phone: selecteStudents.phone || "",
      });
    }
  }, [selecteStudents]);

  return (
    <Dialog
      open={isEditModalOpen}
      onClose={closeEditModal}
      className="relative z-20"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 p-4">
            Edit Student
          </DialogTitle>

          <div className="p-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Batch</label>
                      <Select
                        options={batchOptions}
                        value={batchOptions.find(option => option.value === values.batch) || null}
                        onChange={(selectedOption) => setFieldValue("batch", selectedOption ? selectedOption.value : '')}
                        classNamePrefix="select"
                      />
                      {errors.batch && touched.batch && (
                        <p className="text-red-500 text-sm">{errors.batch}</p>
                      )}
                    </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Stack</label>
                      <Select
                        options={stackOptions}
                        value={stackOptions.find(option => option.value === values.stack) || null}
                        onChange={(selectedOption) => setFieldValue("stack", selectedOption ? selectedOption.value : '')}
                        classNamePrefix="select"
                      />
                      {errors.stack && touched.stack && (
                        <p className="text-red-500 text-sm">{errors.stack}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Week</label>
                      <Select
                        options={weekOptions}
                        value={weekOptions.find(option => option.value === values.week) || null}
                        onChange={(selectedOption) => setFieldValue("week", selectedOption ? selectedOption.value : '')}
                        classNamePrefix="select"
                      />
                      {errors.week && touched.week && (
                        <p className="text-red-500 text-sm">{errors.week}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <Field
                        type="text"
                        name="name"
                        className={`mt-1 block w-full border ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        } rounded-md shadow-sm py-2 px-3 text-gray-700`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <Field
                        type="text"
                        name="phone"
                        className={`mt-1 block w-full border ${
                          errors.phone && touched.phone
                            ? "border-red-500"
                            : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        } rounded-md shadow-sm py-2 px-3 text-gray-700`}
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center transition-transform duration-300 transform hover:rotate-12"
                    >
                      <FaTrashAlt />
                    </button>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default StudentsEdit;
