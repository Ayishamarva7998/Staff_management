import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import * as Yup from "yup";
import Select from "react-select";
import { deletestaff, updatestaff } from "../../../../api/admin_api";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { getstacks, setcommonToken } from "../../../../api/common_api";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  stack: Yup.array().min(1, "At least one stack is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  hire: Yup.number()
    .required("Review Cash is required")
    .positive("Review Cash must be a positive number"),
});

const EditReviwer = ({
  selectedReviewer,
  isEditModalOpen,
  closeEditModal,
  setSelectedReviewer,
}) => {
  const [stackOptions, setStackOptions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    stack: [],
    phone: "",
    hire: "",
  });

  const fetchOptions = async () => {
    setcommonToken();
    try {
      const stacksResponse = await getstacks();
      const formatOptions = (data) =>
        data.map((item) => ({ label: item, value: item }));
      setStackOptions(formatOptions(stacksResponse.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      setStackOptions([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {

    console.log(values)
    try {
      const data = {
        name: values.name,
        phone: String(values.phone),
        stack: values.stack.map(option => option.value),
        hire: Number(values.hire),
      };

      const response = await updatestaff(selectedReviewer._id, data);
      toast.success(response?.data?.message);
      setSelectedReviewer(null);
    } catch (error) {
      console.error("handleSubmit", error);
      toast.error("Failed to update reviewer");
    }

    closeEditModal();
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await deletestaff(selectedReviewer._id);
      toast.success(response.data.message);
      setSelectedReviewer(null);
      closeEditModal();
    } catch (error) {
      console.error("handleDelete", error);
      toast.error("Failed to delete reviewer");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedReviewer && stackOptions.length > 0) {
      setInitialValues({
        name: selectedReviewer?.name || "",
        stack: selectedReviewer?.stack
          ? stackOptions.filter(option =>
              selectedReviewer.stack.includes(option.value)
            )
          : [],
        phone: selectedReviewer?.phone || "",
        hire: selectedReviewer?.hire || "",
      });
    }
  }, [selectedReviewer, stackOptions]);

  return (
    <Dialog open={isEditModalOpen} onClose={closeEditModal} className="relative z-20">
      <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <DialogTitle as="h3" className="text-2xl font-semibold text-gray-900 p-6">
            Edit Reviewer
          </DialogTitle>

          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true} // Ensure Formik reinitializes on new props
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <Field
                        type="text"
                        name="name"
                        className={`mt-1 block w-full border ${
                          errors.name && touched.name ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4`}
                      />
                      {errors.name && touched.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Stack</label>
                      <Select
                        options={stackOptions}
                        value={values.stack}
                        onChange={(selectedOption) => setFieldValue("stack", selectedOption)}
                        isMulti
                        className={`mt-1 w-full border ${
                          errors.stack && touched.stack ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm`}
                        classNamePrefix="select"
                      />
                      {errors.stack && touched.stack && <p className="text-red-500 text-sm">{errors.stack}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <Field
                        type="text"
                        name="phone"
                        className={`mt-1 block w-full border ${
                          errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4`}
                      />
                      {errors.phone && touched.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Review Cash</label>
                      <Field
                        type="number"
                        name="hire"
                        className={`mt-1 block w-full border ${
                          errors.hire && touched.hire ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4`}
                      />
                      {errors.hire && touched.hire && <p className="text-red-500 text-sm">{errors.hire}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center transition-transform duration-300 transform hover:rotate-12"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
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

export default EditReviwer;
