import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import * as Yup from "yup";
import { deletestaff, updatestaff } from "../../../../api/admin_api";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  position: Yup.string().required("Position is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
});

const EmployeeEdit = ({
  selectedEmployee,
  isEditModalOpen,
  closeEditModal,
  setSelectedEmployee,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    position: "",
    phone: "",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setInitialValues({
        name: selectedEmployee.name || "",
        position: selectedEmployee.position || "",
        phone: selectedEmployee.phone || "",
      });
    }
  }, [selectedEmployee]);

  const handleSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        position: values.position,
        phone: String(values.phone),
      };

      const response = await updatestaff(selectedEmployee._id, data);

      toast.success(response?.data?.message);
      setSelectedEmployee(null);
      closeEditModal();
    } catch (error) {
      console.error("handleSubmit", error);
      toast.error("Failed to update advisor");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deletestaff(selectedEmployee._id);
      toast.success(response.data.message);
      setSelectedEmployee(null);
      closeEditModal();
    } catch (error) {
      console.error("handleDelete", error);
      toast.error("Failed to delete advisor");
    }
  };

  return (
    <Dialog
      open={isEditModalOpen}
      onClose={closeEditModal}
      className="relative z-20"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <DialogTitle as="h3" className="text-2xl font-semibold text-gray-900 p-6">
            Edit Advisor
          </DialogTitle>

          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className={`mt-1 block w-full border ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      } rounded-md shadow w-full py-2 px-4 text-gray-700`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <Field
                      type="text"
                      name="position"
                      className={`mt-1 block w-full border ${
                        errors.position && touched.position
                          ? "border-red-500"
                          : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      } rounded-md shadow w-full py-2 px-4 text-gray-700`}
                    />
                    {errors.position && touched.position && (
                      <p className="text-red-500 text-sm">{errors.position}</p>
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
                      } rounded-md shadow w-full py-2 px-4 text-gray-700`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  <div className="relative inline-block mb-4">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center transition-transform duration-300 transform hover:rotate-12"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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

export default EmployeeEdit;
