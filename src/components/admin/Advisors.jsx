import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { viewAdvisors, setAuthToken } from '../../utils/api';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';

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
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={()=>nav('/admin/add-new-staff')}>
          + Add advisor
        </button> */}
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
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          {`${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredAdvisors.length)} of ${filteredAdvisors.length}`}
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

      <Dialog open={!!selectedAdvisor} onClose={() => setSelectedAdvisor(null)} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Advisor Details
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <strong>Name:</strong> {selectedAdvisor ? selectedAdvisor.name : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Email:</strong> {selectedAdvisor ? selectedAdvisor.email : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Batch:</strong> {selectedAdvisor ? selectedAdvisor.batch : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Phone:</strong> {selectedAdvisor ? selectedAdvisor.phone : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedAdvisor(null)}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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

export default Advisor;
