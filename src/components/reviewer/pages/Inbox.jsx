import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { advisorInbox, setAuthToken, viewInbox } from '../../../api/staff_api';
import { getIdFromToken } from '../../../services/authService';

const InboxMessage = ({ notification, onClick }) => {
  const { message, createdAt, status } = notification;

  return (
    <div
      className={`relative p-4 border-b border-gray-200 ${status === 'read' ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 rounded-lg transition duration-300 ease-in-out cursor-pointer`}
      onClick={() => onClick(notification)}
    >
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">{message}</div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-1" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-1" />
          <span>{new Date(createdAt).toLocaleTimeString()}</span>
        </div>
      </div>
      {status === 'unread' && (
        <div className="absolute top-0 right-0 mt-2 mr-2 text-xs text-red-500 bg-white px-2 py-1 rounded-full">
          Unread
        </div>
      )}
    </div>
  );
};

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchNotifications();
    } else {
      navigate('/');
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const id = getIdFromToken();
      const response = await advisorInbox(id);
      
      // Sort notifications: unread first, then by date (latest first)
      const sortedNotifications = response.data.notifications.sort((a, b) => {
        if (a.status === 'unread' && b.status !== 'unread') return -1;
        if (a.status !== 'unread' && b.status === 'unread') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      const id = getIdFromToken();
      await viewInbox(id, notification._id);
      setNotifications(notifications.map(notif =>
        notif._id === notification._id ? { ...notif, status: 'read' } : notif
      ));
      setSelectedNotification(notification);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  return (
    <div className="p-4 w-full h-[85vh] overflow-auto">
      {notifications.map((notification) => (
        <InboxMessage
          key={notification._id}
          notification={notification}
          onClick={handleNotificationClick}
        />
      ))}

      {selectedNotification && (
        <Dialog open={!!selectedNotification} onClose={() => setSelectedNotification(null)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
              <Dialog.Title className="text-xl font-semibold mb-4">
                {selectedNotification.sender?.name ?? 'admin'}
              </Dialog.Title>
              <p className="mb-4">{selectedNotification.message}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  <span>{new Date(selectedNotification.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{new Date(selectedNotification.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Inbox;
