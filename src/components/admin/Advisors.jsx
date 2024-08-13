import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { viewAdvisors, setAuthToken } from '../../utils/api';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiEdit2, FiX } from 'react-icons/fi';

const rowsPerPage = 6;

const Advisor = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [advisors, setAdvisors] = useState([]);
  const [error, setError] = useState(null);

  const nav=useNavigate();
  
  const fetchAdvisors = async () => {
    try {
      const response = await viewAdvisors();
      setAdvisors(response.data);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch advisors');
    }
  };


  const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit advisor:', selectedAdvisor);
  };
  useEffect(() => {
   const token= localStorage.getItem('token');
   if(token){
     setAuthToken(); 
     fetchAdvisors();
  }else{
    nav('/'); 
  }
  }, []);

 
  const filteredAdvisors = advisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdvisors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredAdvisors.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (advisor) => {
    setSelectedAdvisor(advisor);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full max-w-md sm:max-w-sm md:max-w-xs lg:max-w-xs xl:max-w-xs"
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1 + startIndex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.batch }</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
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

<Dialog open={!!selectedAdvisor} onClose={() => setSelectedAdvisor(null)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative flex flex-col items-center p-6 bg-gray-100">
            <img
              src={selectedAdvisor ? selectedAdvisor.profilePicture : '/default-profile.png'}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white mb-4 object-cover"
            />
            <DialogTitle as="h3" className="text-2xl font-semibold text-gray-900">
              {selectedAdvisor ? selectedAdvisor.name : 'N/A'}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">{selectedAdvisor ? selectedAdvisor.email : 'N/A'}</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Batch:</span>
                <span className="text-gray-600">{selectedAdvisor ? selectedAdvisor.batch : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">{selectedAdvisor ? selectedAdvisor.phone : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            >
              <FiEdit2 className="mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setSelectedAdvisor(null)}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              <FiX className="mr-2" />
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
    </div>
  );
};

export default Advisor;
