import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { setAuthToken, viewReviewers } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

;

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
    reviewCash: '',
    totalReview: '',
    totalAmount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const nav =useNavigate();

  // Filter reviewers based on the search term
  const filteredReviewers = reviewers.filter(reviewer =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviewers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviewers.slice(startIndex, startIndex + rowsPerPage);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., update the reviewer data)
    console.log('Updated Reviewer:', formData);
    setSelectedReviewer(formData); // Update the selected reviewer with the new data
    setIsEditing(false); // Return to view mode
  };

  const fetchReviewers= async ()=>{
    try {
      const response = await viewReviewers();
      setReviewers(response.data)
      
    } catch (error) {
      console.log(error);
      setError('Failed to fetch reviewer');
    }
  }

  useEffect(() => {
    const token= localStorage.getItem('token');
    if(token){
      setAuthToken(); 
      fetchReviewers();
   }else{
     nav('/'); 
   }
   }, []);


  return (
    <div className="container mx-auto p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Amount</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalReview||0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                  <button
                    onClick={() => handleDetailsClick(item)}
                    className="hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          {`${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredReviewers.length)} of ${filteredReviewers.length}`}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            <IoMdArrowBack size={24} />
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page + 1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-gray-300`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            <IoMdArrowForward size={24} />
          </button>
        </div>
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
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Stack
                            <input
                              type="text"
                              name="stack"
                              value={formData.stack}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Review Cash
                            <input
                              type="text"
                              name="reviewCash"
                              value={formData.reviewCash}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Total Review
                            <input
                              type="number"
                              name="totalReview"
                              value={formData.totalReview}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Total Amount
                            <input
                              type="text"
                              name="totalAmount"
                              value={formData.totalAmount}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border rounded-md p-2"
                              required
                            />
                          </label>
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
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                          <strong>Review Cash:</strong> {selectedReviewer?.reviewCash}
                        </div>
                        <div className="mb-2">
                          <strong>Total Review:</strong> {selectedReviewer?.totalReview}
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
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => console.log('Pay Cash for', selectedReviewer?.name)}
                    >
                      Pay Cash
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setSelectedReviewer(null)}
                >
                  Close
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
