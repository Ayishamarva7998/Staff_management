import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { allbookings, reviewcount } from '../../../api/staff_api';

const ReviewsTaken = () => {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await allbookings(); // Fetch bookings from API
        console.log(response.data);
        const bookings = response.data;

        // Group bookings by reviewer, ensuring the booking and reviewer exist
        const reviewerMap = bookings.reduce((acc, booking) => {
          if (booking && booking.reviewer) { // Check if booking and reviewer exist
            const reviewerId = booking.reviewer._id;
            if (!acc[reviewerId]) {
              acc[reviewerId] = {
                ...booking.reviewer,
                bookings: [],
              };
            }
            acc[reviewerId].bookings.push(booking);
          }
          return acc;
        }, {});

        // Convert the map to an array of reviewers
        const reviewersArray = Object.values(reviewerMap);
        setReviewers(reviewersArray);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleReviewerClick = (reviewer) => {
    setSelectedReviewer(reviewer);
  };

  const handleAllowClick = async (bookingId) => {
    try {
      await reviewcount(bookingId); // API call to update advisor_accepted to true
      console.log(`Advisor accepted status updated for booking ID: ${bookingId}`);

      // Update the UI to reflect the change
      setSelectedReviewer((prevReviewer) => ({
        ...prevReviewer,
        bookings: prevReviewer.bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, advisor_accepted: true } // Mark the booking as advisor accepted
            : booking
        ),
      }));
    } catch (error) {
      console.error('Failed to update advisor accepted status:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Reviewers List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewers.map((reviewer) => (
          <div
            key={reviewer._id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
            onClick={() => handleReviewerClick(reviewer)}
          >
            <h3 className="text-lg font-semibold text-gray-700">{reviewer.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{reviewer.bookings.length} Booking(s)</p>
          </div>
        ))}
      </div>

      {selectedReviewer && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {selectedReviewer.name} - {selectedReviewer.bookings.length} Booking(s)
          </h2>

          <div className="space-y-4">
            {selectedReviewer.bookings.map((booking) => (
              <div
                key={booking._id}
                className={`p-4 border rounded-lg ${
                  booking.reviewer_accepted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <p className="text-gray-700">
                  <strong>Date:</strong> {new Date(booking.timeslot.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Time:</strong> {booking.timeslot.time}
                </p>
                <p className="text-gray-700">
                  <strong>Description:</strong> {booking.timeslot.description}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {booking.reviewer_accepted ? 'Accepted' : 'Pending'}
                </p>
                <p className="text-gray-700">
                  <strong>Paid Status:</strong> {booking.reviewer.paymentStatus ? "Paid" : "Unpaid"}
                </p>
                {booking.reviewer_accepted && !booking.advisor_accepted && (
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => handleAllowClick(booking._id)}
                  >
                    Allow
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTaken;
