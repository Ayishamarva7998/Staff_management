import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const rowsPerPage = 6;

const Feestable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [review, setReview] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nav = useNavigate();

  // Dummy data
  const dummyData = [
    {
      _id: '1',
      name: 'John Doe',
      studentEmail: 'john.doe@example.com',
      batch: '2024',
      stack: 'MERN',
      reviewCash: '$100',
      date: '2024-08-01',
      time: '10:00',
      paymentStatus: 'paid'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      batch: '2023',
      stack: 'MEAN',
      reviewCash: '$120',
      date: '2024-07-15',
      time: '14:00',
      paymentStatus: 'unpaid'
    },
    {
      _id: '3',
      name: 'Alice Johnson',
      studentEmail: 'alice.johnson@example.com',
      batch: '2022',
      stack: 'LAMP',
      reviewCash: '$150',
      date: '2024-06-30',
      time: '09:00',
      paymentStatus: 'paid'
    },
    {
      _id: '4',
      name: 'Bob Brown',
      studentEmail: 'bob.brown@example.com',
      batch: '2024',
      stack: 'MERN',
      reviewCash: '$90',
      date: '2024-08-03',
      time: '11:00',
      paymentStatus: 'unpaid'
    },
    {
      _id: '5',
      name: 'Charlie Davis',
      studentEmail: 'charlie.davis@example.com',
      batch: '2024',
      stack: 'MEAN',
      reviewCash: '$110',
      date: '2024-07-20',
      time: '13:00',
      paymentStatus: 'paid'
    },
    {
      _id: '6',
      name: 'Daisy Wilson',
      studentEmail: 'daisy.wilson@example.com',
      batch: '2023',
      stack: 'MERN',
      reviewCash: '$130',
      date: '2024-07-25',
      time: '15:00',
      paymentStatus: 'unpaid'
    },
    {
      _id: '7',
      name: 'Eve Adams',
      studentEmail: 'eve.adams@example.com',
      batch: '2024',
      stack: 'MEAN',
      reviewCash: '$140',
      date: '2024-08-05',
      time: '16:00',
      paymentStatus: 'paid'
    }
  ];

  // Filter review based on the search term
  const filteredReview = review.filter(review =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReview.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReview.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (review) => {
    setSelectedReview(review);
  };

  useEffect(() => {
    // Load dummy data instead of fetching from API
    setReview(dummyData);
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stack</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review Cash</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1 + startIndex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.studentEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.batch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stack}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reviewCash}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                  {item.paymentStatus}
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
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          {`${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredReview.length)} of ${filteredReview.length}`}
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
      <Dialog open={Boolean(selectedReview)} onClose={() => setSelectedReview(null)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <DialogTitle className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Review Details</DialogTitle>
      <div className="space-y-6">
        {selectedReview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Name', type: 'text', value: selectedReview.name },
                { label: 'Student Email', type: 'email', value: selectedReview.studentEmail },
                { label: 'Batch', type: 'text', value: selectedReview.batch },
                { label: 'Stack', type: 'text', value: selectedReview.stack },
                { label: 'Review Cash', type: 'text', value: selectedReview.reviewCash },
                { label: 'Date', type: 'date', value: selectedReview.date },
                { label: 'Time', type: 'time', value: selectedReview.time },
              ].map(({ label, type, value }, index) => (
                <div key={index} className="flex flex-col">
                  <label htmlFor={type} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={type}
                    name={type}
                    value={value}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled
                  />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={selectedReview.paymentStatus}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={() => setSelectedReview(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          Close
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>


    </div>
  );
};

export default Feestable;
