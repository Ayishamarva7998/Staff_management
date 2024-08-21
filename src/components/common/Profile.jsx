import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getIdFromToken } from "../../services/authService";
import { getIdfromData, setAuthToken } from "../../api/common_api";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPlus,
  FiLayers,
  FiDatabase,
  FiXCircle,
} from "react-icons/fi";
import AddBatch from "../admin/pages/admin/AddBatch";
import AddStack from "../admin/pages/admin/AddStack";
import DeleteDialog from "../admin/pages/admin/DeleteDialog";
import { deletebatch, deletestack, setAdminAuth } from "../../api/admin_api";
import toast from "react-hot-toast";

const Profile = ({ isOpen, closeModal }) => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isStackDialogOpen, setIsStackDialogOpen] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);

  const [deleteItem, setDeleteItem] = useState({ item: "", type: "" });

  const togglebatchDialog = () => {
    setIsBatchDialogOpen((prev) => !prev);
  };
  const togglestackDialog = () => {
    setIsStackDialogOpen((prev) => !prev);
  };
  const toggleDeleteDialog = (item, type) => {
    setDeleteItem({ item, type });
    setIsDeleteDialog((prev) => !prev);
  };

  const fetchProfile = async () => {
    try {
      const adminId = getIdFromToken();
      const response = await getIdfromData(adminId);
      setData(response.data);
      setRole(response?.data?.role);
    } catch (error) {
      console.log("Profile fetching error", error);
    }
  };

  const stackdelete = async (item) => {
    setAdminAuth();
    try {
      const id = await getIdFromToken();
      const response = await deletestack(id, item);
      toast.success(response?.data?.message);
      fetchProfile();
    } catch (error) {
      console.log("stack delete error", error);
    }
  };

  const batchdelete = async (item) => {
    setAdminAuth();
    try {
      const id = await getIdFromToken();
      const response = await deletebatch (id, item);
      toast.success(response?.data?.message);
      fetchProfile();
    } catch (error) {
      console.log("betch delete error", error);
    }
  };

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken();
      fetchProfile();
    } else {
      nav("/");
    }
  }, [isBatchDialogOpen, isStackDialogOpen ]);

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          {data?.name || ""}
                        </Dialog.Title>

                        {role === "admin" && (
                          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm h-[400px] overflow-auto">
                            <div className="mb-4">
                              <p className="text-base font-medium text-gray-700">
                                Admin Details
                              </p>
                              <p className="text-sm text-gray-500">
                                Email:{" "}
                                <span className="font-medium text-gray-800">
                                  {data?.email || ""}
                                </span>
                              </p>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 flex justify-between items-center">
                                Stacks
                                <button
                                  onClick={() => setIsStackDialogOpen(true)}
                                  className="ml-2 flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                                >
                                  <FiPlus className="mr-2" /> Add Stack
                                </button>
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {Array.isArray(data?.stacks) &&
                                data.stacks.length > 0 ? (
                                  data.stacks.map((stack, index) => (
                                    <div key={index} className="relative group">
                                      <button className="px-3 py-1 flex items-center text-sm font-medium text-white bg-gray-800 rounded-md shadow-sm hover:bg-gray-900">
                                        <FiLayers className="mr-2" /> {stack}
                                      </button>

                                      <button
                                        onClick={() =>
                                          toggleDeleteDialog(stack, "stack")
                                        }
                                        className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500"
                                      >
                                        <FiXCircle />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-600">
                                    No stacks available
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700 flex justify-between items-center">
                                Batches
                                <button
                                  onClick={togglebatchDialog}
                                  className="ml-2 flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                                >
                                  <FiPlus className="mr-2" /> Add Batch
                                </button>
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {Array.isArray(data?.batches) &&
                                data.batches.length > 0 ? (
                                  data.batches.map((batch, index) => (
                                    <div key={index} className="relative group">
                                      <button className="px-3 py-1 flex items-center text-sm font-medium text-white bg-gray-800 rounded-md shadow-sm hover:bg-gray-900">
                                        <FiDatabase className="mr-2" /> {batch}
                                      </button>
                                      <button
                                        onClick={() =>
                                          toggleDeleteDialog(batch, "batch")
                                        }
                                        className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500"
                                      >
                                        <FiXCircle />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-600">
                                    No batches available
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {role === "reviewer" && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Email: {data?.email || ""}
                            </p>
                            <p className="text-sm text-gray-500">
                              Phone: +{data?.phone || ""}
                            </p>
                            Reviewer
                          </div>
                        )}
                        {role === "advisor" && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Email: {data?.email || ""}
                            </p>
                            <p className="text-sm text-gray-500">
                              Phone: +{data?.phone || ""}
                            </p>
                            Advisor
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* batch and stack add Dialog */}

      {isBatchDialogOpen && (
        <AddBatch isOpen={isBatchDialogOpen} onClose={togglebatchDialog} />
      )}
      {isStackDialogOpen && (
        <AddStack isOpen={isStackDialogOpen} onClose={togglestackDialog} />
      )}
      {isDeleteDialog && (
        <DeleteDialog
          isOpen={isDeleteDialog}
          onClose={toggleDeleteDialog}
          onConfirm={(item, type) => {
            if (type === "stack") {
              stackdelete(item);
            } else if (type === "batch") {
              batchdelete(item);
            }
          }}
          item={deleteItem.item}
          type={deleteItem.type}
        />
      )}
    </>
  );
};

export default Profile;
