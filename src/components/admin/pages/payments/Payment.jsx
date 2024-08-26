import React, { useEffect, useState } from 'react';
import { viewReviewers, paymentHistory, setAdminAuth } from '../../../../api/admin_api';

const Payments = () => {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAdminAuth();
    } else {
      nav("/");
    }

    const fetchReviewers = async () => {
      try {
        const response = await viewReviewers();
        setReviewers(response.data);
      } catch (error) {
        setError('Failed to fetch reviewers.');
      }
    };

    fetchReviewers();
  }, []);

  const handleReviewerClick = async (reviewer) => {
    setSelectedReviewer(reviewer);

    try {
      const response = await paymentHistory(reviewer._id);
      console.log(response.data,"his");
      setPaymentHistoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setPaymentHistoryData([]);
    }
  };

  const handleBackClick = () => {
    setSelectedReviewer(null);
    setPaymentHistoryData([]);
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Reviewers List */}
      <div className={`w-full md:w-1/3 ${selectedReviewer ? 'hidden md:block' : ''}`}>
        <h2 className="text-xl font-bold mb-4">Reviewers</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="bg-white shadow-md rounded-lg overflow-hidden">
            {reviewers.map((reviewer) => (
              <li 
                key={reviewer._id} 
                onClick={() => handleReviewerClick(reviewer)}
                className={`cursor-pointer px-4 py-3 hover:bg-blue-50 border-b last:border-none ${
                  selectedReviewer && selectedReviewer._id === reviewer._id
                    ? 'bg-blue-100 font-semibold'
                    : ''
                }`}
              >
                {reviewer.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment History */}
      <div className="w-full md:w-2/3">
        {selectedReviewer ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <button
              onClick={handleBackClick}
              className="text-blue-500 hover:underline mb-4"
            >
              &larr; Back to Reviewers
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Payment History for {selectedReviewer.name}
            </h3>
            <ul className="space-y-3">
              {paymentHistoryData.length > 0 ? (
                paymentHistoryData.map((payment, index) => (
                  <li key={index} className="border p-4 rounded-lg">
                    <p><strong>Date:</strong> {formatDate(payment.createdAt)}</p>
                    <p><strong>Amount:</strong> ${payment.amount}</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No payment history available.</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
            <p>Select a reviewer to see their payment history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
