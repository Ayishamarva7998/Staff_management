import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { getstudentsbyadvisor, setstaffAuthToken } from "../../../../api/staff_api";
import { getIdFromToken } from "../../../../services/authService";
import StudentsDetails from "./StudentsDetails";



const Students = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selecteStudents, setSelectedStudents] = useState(null);

  const [students, setStudents] = useState([]);

  const [selectedStack, setSelectedStack] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const screenHeight = window.innerHeight;
      const calculatedRows = Math.max(Math.floor((screenHeight - 300) / 60), 1);
      setRowsPerPage(calculatedRows);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // filter student 
  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStack ? student.stack === selectedStack : true) &&
      (selectedBatch ? student.batch === selectedBatch : true) &&
      (selectedWeek ? student.week === selectedWeek : true)
  );

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredStudents.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (student) => {
    setSelectedStudents(student);
  };
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStack("");
    setSelectedBatch("");
    setSelectedWeek("");
  };

  //  filters in stack ,batch, week 
  const uniqueStacks = [...new Set(students.map((student) => student.stack))];
  const uniqueBatches = [...new Set(students.map((student) => student.batch))];
  const uniqueWeeks = [...new Set(students.map((student) => student.week))];

  const fetchStudents = async () => {
    const id = await getIdFromToken();
    try {
      const response = await getstudentsbyadvisor(id);
      setStudents(response?.data);
    } catch (error) {
      console.log("fetch error", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setstaffAuthToken();
      fetchStudents();
    } else {
      nav("/");
    }
  }, [selecteStudents]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 w-full sm:w-56 text-sm placeholder-gray-400 hover:border-gray-400 focus:border-blue-600"
        />
        <select
          value={selectedStack}
          onChange={(e) => setSelectedStack(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 w-full sm:w-56 text-sm hover:border-gray-400 focus:border-blue-600"
        >
          <option value="">All Stacks</option>
          {uniqueStacks.map((stack) => (
            <option key={stack} value={stack}>
              {stack}
            </option>
          ))}
        </select>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 w-full sm:w-56 text-sm hover:border-gray-400 focus:border-blue-600"
        >
          <option value="">All Batches</option>
          {uniqueBatches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 w-full sm:w-56 text-sm hover:border-gray-400 focus:border-blue-600"
        >
          <option value="">All Weeks</option>
          {uniqueWeeks.map((week) => (
            <option key={week} value={week}>
              {week}
            </option>
          ))}
        </select>
        <button
          onClick={handleClearFilters}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 w-full sm:w-56 text-sm font-semibold"
        >
          <FaTimes className="mr-2" />
          Clear Filters
        </button>
      </div>

      <p className="text-sm text-gray-900 text-end mb-2">
        Total Students: {filteredStudents.length}
      </p>

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
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Stack
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Week
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDetailsClick(item)}
              >
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
                  {item.batch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.stack}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.week}
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



      {selecteStudents && (
        <StudentsDetails selecteStudents={selecteStudents} setSelectedStudents={setSelectedStudents}/>
      )}
    </div>
  );
};

export default Students;
