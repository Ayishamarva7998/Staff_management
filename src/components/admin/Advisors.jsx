import React, { useEffect, useState } from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { viewAdvisors, setAuthToken, updateStaff, deletestaff } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const rowsPerPage = 6;

const Advisor = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [advisors, setAdvisors] = useState([]);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batches, setBatches] = useState([]);
  const [phone, setPhone] = useState('');
  const [batchesToRemove, setBatchesToRemove] = useState([]);

  const nav = useNavigate();

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
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchAdvisors();
    } else {
      nav('/');
    }
  }, [nav]);

  useEffect(() => {
    if (selectedAdvisor) {
      setName(selectedAdvisor.name);
      setEmail(selectedAdvisor.email);
      setBatches(selectedAdvisor.batch);
      setPhone(selectedAdvisor.phone);
    }
  }, [selectedAdvisor]);

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
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await updateStaff(selectedAdvisor._id, { email, name, phone, batch: batches, removeBatch: batchesToRemove });
      setSelectedAdvisor(prev => ({ ...prev, email, name, phone, batch: batches }));

      setBatchesToRemove([]);
      setEditMode(false);
      setSelectedAdvisor(null); // Close the modal
      fetchAdvisors(); // Refresh the advisor list
      nav('/admin/advisors'); // Redirect back to the main list page
    } catch (error) {
      console.log(error);
      setError('Failed to update advisor');
    }
  };

  const handleDelete = async () => {
    try {
      await deletestaff(selectedAdvisor._id);
; // Close the modal
      fetchAdvisors(); // Refresh the advisor list
      setSelectedAdvisor(null);
      nav('/admin/advisors'); // Redirect back to the main list page
    } catch (error) {
      console.log(error);
      setError('Failed to delete advisor');
    }
  };

  const handleAddBatch = () => {
    setBatches([...batches, '']);
  };

  const handleBatchChange = (index, value) => {
    const updatedBatches = [...batches];
    updatedBatches[index] = value;
    setBatches(updatedBatches);
  };

  const handleRemoveBatch = (index) => {
    const batchToRemove = batches[index];
    setBatchesToRemove([...batchesToRemove, batchToRemove]);
    const updatedBatches = batches.filter((_, i) => i !== index);
    setBatches(updatedBatches);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-1/3 mb-4 md:mb-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors">
          + Add advisor
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batches</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.batch.join(', ')}
                </td>
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
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 transition-colors"
          >
            <IoMdArrowBack size={24} />
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page + 1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-gray-300 transition-colors`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 transition-colors"
          >
            <IoMdArrowForward size={24} />
          </button>
        </div>
      </div>

      <Dialog open={!!selectedAdvisor} onClose={() => setSelectedAdvisor(null)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
            <DialogTitle className="text-2xl font-semibold mb-4">
              {editMode ? 'Edit Advisor' : 'Advisor Details'}
            </DialogTitle>
            {selectedAdvisor && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!editMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Batches</label>
                  {batches.map((batch, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={batch}
                        onChange={(e) => handleBatchChange(index, e.target.value)}
                        disabled={!editMode}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBatch(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      type="button"
                      onClick={handleAddBatch}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Add Batch
                    </button>
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAdvisor(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Advisor;
