import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { setAuthToken, viewReviewers, updateStaff, deletestaff } from '../../utils/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const rowsPerPage = 6;

const Reviewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stack: '',
    hire: '',
    count: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reviewers based on the search term
  const filteredReviewers = reviewers.filter(reviewer =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviewers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviewers.slice(startIndex, startIndex + rowsPerPage).map(item => {
    const totalAmount = item.hire * item.count;
    return { ...item, totalAmount };
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setFormData(reviewer); // Set form data to current reviewer's details
    setIsEditing(false); // Start in view mode
  };

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Make API call to update the staff/reviewer
      await updateStaff(selectedReviewer._id, formData);
  
      // Update the reviewer state with the new data
      setSelectedReviewer(formData);
  
      // Optionally, you may want to refetch the reviewers list to ensure data is up-to-date
      fetchReviewers();
  
      // Exit edit mode
      setIsEditing(false);
  
      // Provide feedback to the user
      alert("Reviewer details updated successfully");
    } catch (error) {
      console.error("Error updating reviewer:", error);
      setError("Failed to update reviewer details");
    }
  };

  const fetchReviewers = async () => {
    try {
      const response = await viewReviewers();
      setReviewers(response.data);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch reviewers');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchReviewers();
    } else {
      nav('/');
    }
  }, []);

  const handleDelete = async () => {
    try {
      await deletestaff(selectedReviewer._id);
      fetchReviewers(); // Refresh the reviewers list
      setSelectedReviewer(null);
    } catch (error) {
      console.log(error);
      setError('Failed to delete reviewer');
    }
  };

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

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
  
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
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
              fetchReviewers(); // Refresh the reviewers list
              setSelectedReviewer(null); // Close the modal and return to table view
              alert("Payment successful");
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
      alert("There was an error processing your payment. Please try again.");
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Add Reviewer
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stack</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review Cash</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1 + startIndex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stack}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.hire}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paymentStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleDetailsClick(item)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <IoMdArrowBack />
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <IoMdArrowForward />
        </button>
      </div>

      <Dialog open={!!selectedReviewer} onClose={() => setSelectedReviewer(null)} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-xl sm:p-6"
            >
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Reviewer Details
                  </DialogTitle>
                  <div className="mt-2">
                    {isEditing ? (
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Stack</label>
                          <input
                            type="text"
                            name="stack"
                            value={formData.stack}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Review Cash</label>
                          <input
                            type="number"
                            name="hire"
                            value={formData.hire}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Total Review</label>
                          <input
                            type="number"
                            name="count"
                            value={formData.count}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col">
                        <div className="mb-2">
                          <strong>Name:</strong> {selectedReviewer?.name}
                        </div>
                        <div className="mb-2">
                          <strong>Email:</strong> {selectedReviewer?.email}
                        </div>
                        <div className="mb-2">
                          <strong>Phone Number:</strong> {selectedReviewer?.phone}
                        </div>
                        <div className="mb-2">
                          <strong>Stack:</strong> {selectedReviewer?.stack}
                        </div>
                        <div className="mb-2">
                          <strong>Review Cash:</strong> {selectedReviewer?.hire}
                        </div>
                        <div className="mb-2">
                          <strong>Total Review:</strong> {selectedReviewer?.count}
                        </div>
                        <div className="mb-2">
                          <strong>Total Amount:</strong> {selectedReviewer?.totalAmount}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                {!isEditing && (
                  <>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                    {selectedReviewer?.paymentStatus !== 'PAID' && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={handlePayment}
                      >
                        Pay Cash
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setSelectedReviewer(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Reviewer;
