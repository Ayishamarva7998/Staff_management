import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getIdFromToken } from "../../services/authService";
import { getDatafromId, setcommonToken } from "../../api/common_api";
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
import UpdatePasswordModal from "./UpdatePasswordModal";
import { RingLoader } from "react-spinners";
import { FaEnvelope, FaPhone, FaTimesCircle, FaUserTie } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const Profile = ({ isOpen, closeModal }) => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isStackDialogOpen, setIsStackDialogOpen] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isUpdatePass,setIsUpdatePass]=useState(false);

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
  const toggleUpdatepassDialog = () => {
    setIsUpdatePass((prev) => !prev);
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const adminId = await getIdFromToken();
      const response = await getDatafromId(adminId);
      setData(response.data);
      setRole(response?.data?.role);
    } catch (error) {
      console.log("Profile fetching error", error);
    }finally {
      setIsLoading(false); 
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
      setcommonToken();
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
                           {isLoading ? (
                            <div className="flex justify-center items-center">
                              <RingLoader color="#4A90E2" size={60} />
                            </div>
                          ) : (
                            data?.name || ""
                          )}
                        </Dialog.Title>

                        {role === "admin" && (
                          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm h-[400px] overflow-auto">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4">
      <div className="flex-shrink-0">
        <MdAdminPanelSettings className="text-6xl text-indigo-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{data?.name || "Admin"}</h2>
      </div>
    </div>
                           
                            <div className="flex items-center space-x-3 mb-4">
        <FaEnvelope className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700">{data?.email || "N/A"}</p>
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
  <div className="p-5">
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="flex-shrink-0">
        <FaUserTie className="text-6xl text-indigo-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{data?.name || "Reviewer"}</h2>
        <p className="text-sm text-gray-600">Reviewer</p>
      </div>
    </div>
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-3">
        <FaEnvelope className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700">{data?.email || "N/A"}</p>
      </div>
      <div className="flex items-center space-x-3">
        <FaPhone className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700">+{data?.phone || "N/A"}</p>
      </div>
      <div className="flex items-center space-x-3">
        <RiMoneyRupeeCircleFill className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700"> {data?.hire || "N/A"}</p>
      </div>
    </div>
    
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-900">Stack</h3>
      <ul className=" flex flex-wrap gap-4 pl-0 ">
        {data?.stack && data.stack.length > 0 ? (
          data.stack.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start before:content-['•'] before:text-gray-500 before:mr-1">{item}</li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No stack information available</li>
        )}
      </ul>
    </div>   
  </div>
)}


{role === "advisor" && (
  <div className="p-5">
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="flex-shrink-0">
        <FaUserTie className="text-6xl text-indigo-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{data?.name || "Advisor"}</h2>
        <p className="text-sm text-gray-600">Advisor</p>
      </div>
    </div>
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-3">
        <FaEnvelope className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700">{data?.email || "N/A"}</p>
      </div>
      <div className="flex items-center space-x-3">
        <FaPhone className="text-gray-600 text-lg" />
        <p className="text-sm font-medium text-gray-700">+{data?.phone || "N/A"}</p>
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-900">Batch</h3>
      <ul className="flex flex-wrap gap-4 pl-0">
        {data?.batch && data.batch.length > 0 ? (
          data.batch.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start before:content-['•'] before:text-gray-500 before:mr-1">{item}</li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No batch information available</li>
        )}
      </ul>
    </div>
  </div>
)}

                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={toggleUpdatepassDialog}
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

      {isUpdatePass&&(<UpdatePasswordModal isOpen={isUpdatePass} onClose={toggleUpdatepassDialog}/>)}
    </>
  );
};

export default Profile;
