import React, { useEffect, useState } from 'react';
import { paymentHistory } from '../../../../api/admin_api';
import { Dialog } from '@headlessui/react';
import { FaTimes, FaRupeeSign } from 'react-icons/fa'; // Close and Rupee icons
import { MdFilterList } from 'react-icons/md'; // Filter icon
import { HiCalendar, HiClock } from 'react-icons/hi'; // Calendar and Clock icons

const PaymentDetails = ({ isOpen, onClose, reviewer }) => {
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState('');
  const [selectedPaymentYear, setSelectedPaymentYear] = useState('');

  const handlePaymentMonthChange = (event) => {
    setSelectedPaymentMonth(event.target.value);
  };

  const handlePaymentYearChange = (event) => {
    setSelectedPaymentYear(event.target.value);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    return `${date.toLocaleDateString(undefined, dateOptions)} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const filteredPaymentHistory = paymentHistoryData.filter((payment) => {
    const paymentDate = new Date(payment.createdAt);
    const paymentMonth = paymentDate.getMonth() + 1;
    const paymentYear = paymentDate.getFullYear();

    const selectedMonth = selectedPaymentMonth ? new Date(`${selectedPaymentMonth} 1, 2020`).getMonth() + 1 : null;
    const selectedYear = selectedPaymentYear ? parseInt(selectedPaymentYear, 10) : null;

    return (
      (!selectedMonth || paymentMonth === selectedMonth) &&
      (!selectedYear || paymentYear === selectedYear)
    );
  });

  const years = [...new Set(paymentHistoryData.map(payment => new Date(payment.createdAt).getFullYear()))].sort((a, b) => b - a);

  useEffect(() => {
    if (reviewer) {
      const fetchPaymentHistory = async () => {
        try {
          const response = await paymentHistory(reviewer._id);
          setPaymentHistoryData(response.data);
        } catch (error) {
          console.error('Failed to fetch payment history:', error);
          setPaymentHistoryData([]);
        }
      };

      fetchPaymentHistory();
    }
  }, [reviewer]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors text-lg md:text-xl"
          >
            <FaTimes className="h-6 w-6" />
          </button>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="mr-2 text-lg md:text-xl">{reviewer.name}</span>
            <span className="text-sm md:text-lg text-gray-500">Payment History</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <label htmlFor="paymentMonthFilter" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MdFilterList className="mr-2 text-gray-500 text-lg md:text-xl" />
                Filter by Month
              </label>
              <select
                id="paymentMonthFilter"
                value={selectedPaymentMonth}
                onChange={handlePaymentMonthChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={new Date(0, i).toLocaleString('default', { month: 'long' })}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="paymentYearFilter" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MdFilterList className="mr-2 text-gray-500 text-lg md:text-xl" />
                Filter by Year
              </label>
              <select
                id="paymentYearFilter"
                value={selectedPaymentYear}
                onChange={handlePaymentYearChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4 h-[299px] overflow-auto">
            <ul className="space-y-4">
              {filteredPaymentHistory.length > 0 ? (
                filteredPaymentHistory.map((payment, index) => (
                  <li key={index} className="p-4 border border-gray-200 rounded-lg shadow-md bg-gray-50 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaRupeeSign className="text-gray-500 h-5 w-5 md:h-6 md:w-6" />
                        <span>Amount: <span className="font-normal text-gray-500">{payment.amount} INR</span></span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 flex items-center space-x-2 mt-1">
                        <HiCalendar className="text-gray-500 h-5 w-5 md:h-6 md:w-6" />
                        <span>Payment Date & Time: <span className="font-normal text-gray-500">{formatDateTime(payment.createdAt)}</span></span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 flex items-center space-x-2 mt-1">
                        <HiClock className="text-gray-500 h-5 w-5 md:h-6 md:w-6" />
                        <span>Status: <span className={`font-normal ${payment.paymentStatus ? 'text-green-500' : 'text-red-500'}`}>{payment.paymentStatus ? 'Paid' : 'Pending'}</span></span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 flex items-center space-x-2 mt-1">
                        <span className="font-bold">Payment ID:</span> <span className="font-normal text-gray-500">{payment.id}</span>
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center">No payment history available.</p>
              )}
            </ul>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaymentDetails;
