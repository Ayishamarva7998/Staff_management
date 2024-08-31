import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { FiUser, FiEdit2, FiX } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";
import StudentsEdit from "./StudentsEdit";
// import EditAdvisor from "./EditAdvisor";

const StudentsDetails = ({ selecteStudents, setSelectedStudents}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <>
      <Dialog
        open={!!selecteStudents}
        onClose={() => setSelectedStudents(null)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative flex flex-col items-center p-6 bg-gray-100">
              <FaUserGraduate className="h-24 w-24 mb-4 text-gray-400" />
              <DialogTitle
                as="h3"
                className="text-2xl font-semibold text-gray-900"
              >
                {selecteStudents?.name || "Loading..."}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {selecteStudents?.email || "Loading..."}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Batch:</span>
                <span className="text-gray-600">
                  {selecteStudents?.batch || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Stack:</span>
                <span className="text-gray-600">
                  {selecteStudents?.stack || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">
                  {selecteStudents?.phone || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Week:</span>
                <span className="text-gray-600">
                  {selecteStudents?.week || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Join Date:</span>
                <span className="text-gray-600">
                  {selecteStudents?.created_at
                    ? new Date(selecteStudents.created_at).toLocaleDateString()
                    : "Loading..."}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                <FiEdit2 className="mr-2" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudents(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <FiX className="mr-2" />
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <StudentsEdit
          selecteStudents={selecteStudents}
          setSelectedStudents={setSelectedStudents}
          isEditModalOpen={isEditModalOpen}
          closeEditModal={closeEditModal}
        />
      )}
    </>
  );
};

export default StudentsDetails;
