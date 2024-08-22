import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiLock, FiXCircle } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RingLoader } from "react-spinners";
import { getIdFromToken } from "../../services/authService";
import { updatePassword } from "../../api/common_api";
import toast from "react-hot-toast";

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    
    onSubmit: async (values) => {
      setIsLoading(true);
      const id =await getIdFromToken();

      try {
       const response = await updatePassword(id,values);
       console.log(response)
       toast.success(response?.data?.message);
        onClose();        
      } catch (error) {
        console.log( 'password change failed',error);
        toast.error(error?.response?.data?.message);
        setIsLoading(false);
      }

      
    },
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all duration-500">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Update Password
          </Dialog.Title>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <FiXCircle size={24} />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="px-6 py-4 space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.currentPassword}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.newPassword}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <FiLock className="mr-2" />
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="flex justify-center p-4">
            <RingLoader color="#2563EB" size={48} />
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default UpdatePasswordModal;
