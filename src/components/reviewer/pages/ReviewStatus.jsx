import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { getIdFromToken } from '../../../services/authService';
import { totalreviews } from '../../../api/staff_api'; // Assuming you have this API utility

const rowsPerPage = 5;

const ReviewStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const nav = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const id = getIdFromToken();
        const response = await totalreviews(id);
        console.log(response.data, "sdas");
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setError('Failed to load reviews');
        setReviews([]);
      }
    };

    fetchReviews();
    console.log("revwsa", reviews);
  }, []);

  // Filter reviews based on the search term and date
  const filteredReviews = reviews.filter(review => {
    const matchesSearchTerm = review.advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate === '' || review.timeslot.date === searchDate;
    return matchesSearchTerm && matchesDate;
  });

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviews.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (review) => {
    setSelectedReview(review);
  };

  const handleCloseDialog = () => {
    setSelectedReview(null);
  };

  return (
    <div className="container mx-auto p-4 overflow-auto">
      <div className="flex justify-end items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 border rounded-md"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Advisor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stack</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1 + startIndex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.advisor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.batch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.stack}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timeslot?.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timeslot?.time}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.reviewer_accepted ? 'text-green-500' : 'text-red-500'}`}>
                  {item.reviewer_accepted ? 'Accepted' : 'Pending'}
                </td>
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
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center sm:justify-end gap-3 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-gray-300 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg"
          >
            <IoMdArrowBack size={20} />
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                currentPage === page + 1
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg"
          >
            <IoMdArrowForward size={20} />
          </button>
        </div>
      )}

      <Dialog open={Boolean(selectedReview)} onClose={handleCloseDialog} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Review Details</DialogTitle>
            <div className="space-y-6">
              {selectedReview && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Advisor Name', type: 'text', value: selectedReview?.advisor.name },
                      { label: 'Student Email', type: 'email', value: selectedReview?.email },
                      { label: 'Batch', type: 'text', value: selectedReview?.batch },
                      { label: 'Stack', type: 'text', value: selectedReview?.stack },
                      { label: 'Review Status', type: 'text', value: selectedReview?.reviewer_accepted ? 'Accepted' : 'Pending' },
                      { label: 'Date', type: 'date', value: selectedReview?.timeslot.date },
                      { label: 'Time', type: 'time', value: selectedReview?.timeslot.time },
                    ].map((field) => (
                      <div key={field.label} className="flex flex-col">
                        <label className="font-semibold text-gray-700">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value || ''}
                          disabled
                          className="mt-2 px-4 py-2 border rounded-md bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex justify-center md:justify-end mt-8 gap-4">
                <button
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-all duration-300 shadow-md"
                  onClick={handleCloseDialog}
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ReviewStatus;
