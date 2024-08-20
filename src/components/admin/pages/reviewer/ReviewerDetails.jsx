import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { FiUser, FiEdit2, FiX, FiDollarSign } from "react-icons/fi";
import EditReviwer from "./EditReviwer";
import toast from "react-hot-toast";
import axios from "axios";

const Reviewerdetails = ({ selectedReviewer, setSelectedReviewer }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const handlePaymentClick = async () => {
    const scriptLoaded = await loadRazorpayScript();
  
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }
  
    try {
      const orderResult = await axios.post(`http://localhost:4500/api/admin/payment/${selectedReviewer._id}`);
      const { amount, id: razorpay_order_id, currency } = orderResult.data;
  
      const options = {
        key: "rzp_test_3YFqc3qjVhg3aK", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: razorpay_order_id,
        handler: async function (response) {
          // Prepare payment details for verification
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
  
          try {
            // Send payment details to backend for verification
            const verifypayments = await axios.post('http://localhost:4500/api/admin/verifypayment', paymentDetails);

            if (verifypayments.status === 200) {
              console.log('Payment verified successfully');
              // Optionally, update the UI or notify the user





            } else {
              console.error('Payment verification failed');
              // Handle verification failure
            }
          } catch (error) {
            console.error('Error while verifying payment:', error);
            // Handle network or server errors
          }
        },
        prefill: {
          name: selectedReviewer.name,
          email: selectedReviewer.email,
          contact: selectedReviewer.phone,
        },
        notes: {
          address: "Your Company Address",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
  
    } catch (error) {
      console.error("Error while creating Razorpay order:", error);
      toast.error("There was an error processing your payment. Please try again.");
    }
    
  };



  
  const totalAmount = selectedReviewer?.totalAmount || 0;
  return (
    <>
      <Dialog
        open={!!selectedReviewer}
        onClose={() => setSelectedReviewer(null)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md sm:max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative flex flex-col items-center p-6 bg-gray-100">
              {selectedReviewer?.profilePicture ? (
                <img
                  src={selectedReviewer?.profilePicture}
                  alt="Profile"
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white mb-4 object-cover shadow-md"
                />
              ) : (
                <FiUser className="h-20 w-20 sm:h-24 sm:w-24 mb-4 text-gray-400" />
              )}

              <DialogTitle as="h3" className="text-2xl font-semibold text-gray-900">
                {selectedReviewer?.name || "Loading..."}
              </DialogTitle>

              <p className="text-sm text-gray-600 mt-1">
                {selectedReviewer?.email || "Loading..."}
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Phone", value: selectedReviewer?.phone },
                  { label: "Review Cash", value: selectedReviewer?.hire },
                  { label: "Total Review", value: selectedReviewer?.count },                  
                  {
                    label: "Payment Status",
                    value: selectedReviewer?.paymentStatus ? "Paid" : "Unpaid"
                  },
                  {
                    label: "Stack",
                    value: selectedReviewer?.stack
                      ? Array.isArray(selectedReviewer.stack)
                        ? selectedReviewer.stack.join(", ")
                        : selectedReviewer.stack
                      : "Loading...",
                  },  
                  {
                    label: "Total Amount",
                    value: selectedReviewer.totalAmount
                      ? `${selectedReviewer.totalAmount}`
                      : "Loading...",
                    isPayment: true,
                  },                
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-r border-gray-300 py-2 pr-4"
                  >
                    <span className="font-medium text-gray-700">{item.label}:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{!item.isPayment? item.value || "Loading...":''}</span>
                      {item.isPayment && (
                        <button
                          type="button"
                          onClick={handlePaymentClick}
                          className="ml-4 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 border border-green-700 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        >
                          <FiDollarSign className="mr-1" />
                          ₹{totalAmount.toLocaleString('en-IN')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 flex  justify-between items-center rounded-b-lg border-t border-gray-300">
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition mb-2 sm:mb-0"
              >
                <FiEdit2 className="mr-2" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => setSelectedReviewer(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-700 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
        <EditReviwer
          selectedReviewer={selectedReviewer}
          setSelectedReviewer={setSelectedReviewer}
          isEditModalOpen={isEditModalOpen}
          closeEditModal={closeEditModal}
        />
      )}
    </>
  );
};

export default Reviewerdetails;
