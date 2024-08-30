import React, { useEffect, useState } from "react";
import { viewReviewers, setAdminAuth, reviewcount } from "../../../../api/admin_api";
import PaymentDetails from "./PaymentDetails";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

const Payments = () => {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [counts, setCounts] = useState({
    completecount: 0,
    incompletecount: 0,
    pendingcount: 0,
    totalcount: 0,
    paymentcompletecount: 0,
  });


  const fetchReviewers = async () => {
    try {
      const response = await viewReviewers();
      setReviewers(response.data);
    } catch (error) {
      setError("Failed to fetch reviewers.");
    }
  };


  const ReviewersCont = async ()=>{
    try {
      const countResponse = await reviewcount();
      setCounts({
        completecount: countResponse?.data?.completecount || 0,
        incompletecount: countResponse?.data?.incompletecount || 0,
        pendingcount: countResponse?.data?.pendingcount || 0,
        totalcount: countResponse?.data?.totalcount || 0,
        paymentcompletecount: countResponse?.data?.paymentcompletecount || 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAdminAuth();
    } else {
      window.location.href = "/";
    }   

    fetchReviewers();
    ReviewersCont();

    // Calculate rows per page based on screen height
    const handleResize = () => {
      const screenHeight = window.innerHeight;
      const calculatedRows = Math.max(Math.floor((screenHeight - 300) / 70), 1);
      setRowsPerPage(calculatedRows);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReviewerClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReviewer(null);
  };

  const handleStackChange = (event) => {
    setSelectedStack(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Generate a unique list of stacks for the filter options
  const allStacks = [
    ...new Set(reviewers.flatMap((reviewer) => reviewer.stack)),
  ];

  const filteredReviewers = reviewers.filter((reviewer) => {
    if (!selectedStack) return true;
    return reviewer.stack.includes(selectedStack);
  });

  const totalPages = Math.ceil(filteredReviewers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviewers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mx-auto p-4 overflow-auto h-[90vh]">
      {/* filter input  */}
      <div className="mb-4">
        <div >
        <label
          htmlFor="stackFilter"
          className="block text-sm font-medium text-gray-700 mb-2"
          >
          Filter by Stack
        </label>
        <select
          id="stackFilter"
          value={selectedStack}
          onChange={handleStackChange}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full max-w-md sm:max-w-sm md:max-w-xs lg:max-w-xs xl:max-w-xs"
          >
          <option value="">All Stacks</option>
          {allStacks.map((stack, i) => (
            <option key={i} value={stack}>
              {stack}
            </option>
          ))}
        </select>
        </div>

        {/* Showing all detail in review  */}
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-3">
  {[
    { label: "Payment Complete Review", count: counts.paymentcompletecount, color: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-300" },
    { label: "Total Review", count: counts.totalcount, color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-300" },
    { label: "Complete Review", count: counts.completecount, color: "text-teal-700", bgColor: "bg-teal-50", borderColor: "border-teal-300" },
    { label: "Incomplete Review", count: counts.incompletecount, color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-300" },
    { label: "Pending Review", count: counts.pendingcount, color: "text-yellow-700", bgColor: "bg-yellow-50", borderColor: "border-yellow-300" },
  ].map(({ label, count, color, bgColor, borderColor }, index) => (
    <div
      key={index}
      className={`p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center border ${bgColor} ${borderColor} transition-transform transform hover:scale-105 hover:shadow-md`}
    >
      <span className="text-xs font-semibold text-gray-700 mb-1">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{count}</span>
    </div>
  ))}
</div>


      </div>  

      {/* totel count  */}

      <div className="mb-4">
        <p className="text-sm text-gray-900 text-end mb-2">
          Total {selectedStack && selectedStack} Reviewers:{" "}
          {filteredReviewers.length}
        </p>

        {/* table data  */}

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
                  Stack
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((reviewer, index) => (
                <tr
                  key={reviewer._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleReviewerClick(reviewer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reviewer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reviewer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reviewer.stack.length > 0
                      ? reviewer.stack.join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reviewer.phone || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination working buttons   */}

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
      </div>

      {/* Payment History Modal */}
      {selectedReviewer && (
        <PaymentDetails
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          reviewer={selectedReviewer}
        />
      )}
    </div>
  );
};

export default Payments;
