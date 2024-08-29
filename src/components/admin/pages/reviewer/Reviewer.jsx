import React, { useEffect, useState } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { setAdminAuth, viewReviewers } from "../../../../api/admin_api";
import Reviewerdetails from "./ReviewerDetails";


const Reviewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const nav = useNavigate();

  // Filter reviewers based on the search term
  const filteredReviewers = reviewers.filter(
    (reviewer) =>
      reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviewers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviewers
    .slice(startIndex, startIndex + rowsPerPage)
    .map((item) => {
      const totalAmount = item.hire * item.count;

      return { ...item, totalAmount };
    });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (reviewer) => {
    setSelectedReviewer(reviewer);
  };

  const fetchReviewers = async () => {
    try {
      const response = await viewReviewers();
      setReviewers(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch reviewer");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAdminAuth();
      fetchReviewers();
    } else {
      nav("/");
    }
  }, [selectedReviewer]);


  useEffect(() => {
    // Calculate rows per page based on screen height
    const handleResize = () => {
     const screenHeight = window.innerHeight;
     const calculatedRows = Math.max(Math.floor((screenHeight - 300) / 60), 1);
     setRowsPerPage(calculatedRows);
   };
   
   handleResize();
   window.addEventListener('resize', handleResize);
   
   return () => window.removeEventListener('resize', handleResize);
      
     }, []);

  return (
    <div className="container mx-auto p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full max-w-md sm:max-w-sm md:max-w-xs lg:max-w-xs xl:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* totel count  */}
      <p className="text-sm text-gray-900 text-end mb-2">
      Total Reviewers: {filteredReviewers.length || 'loading...'}
       </p>


      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Stack
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Review Cash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Review
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1 + startIndex}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {" "}
                  {Array.isArray(item.stack)
                    ? item.stack.join(", ")
                    : item.stack}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.hire || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.totalAmount || 0}
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
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
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

      {selectedReviewer && (
        <Reviewerdetails
          selectedReviewer={selectedReviewer}
          setSelectedReviewer={setSelectedReviewer}
        />
      )}
    </div>
  );
};

export default Reviewer;
