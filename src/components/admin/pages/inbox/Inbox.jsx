import React, { useState } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

const InboxMessage = ({ message, onClick }) => {
  const { sender, content, programDate, time, read } = message;

  return (
    <div
      className={`relative p-4 border-b border-gray-200 ${read ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 rounded-lg transition duration-300 ease-in-out cursor-pointer`}
      onClick={() => onClick(message)}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold">{sender}</div>
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-1" />
          <span>{programDate}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-1" />
          <span>{time}</span>
        </div>
      </div>
      {!read && (
        <div className="absolute top-0 right-0 mt-2 mr-2 text-xs text-red-500 bg-white px-2 py-1 rounded-full">
          Unread
        </div>
      )}
    </div>
  );
};

const Inbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Alice Johnson',
      content: 'Hi team, please review the latest project update.',
      programDate: '2024-08-07',
      time: '09:15 AM',
      details: 'Detailed information about Alice’s message.',
      read: false
    },
    {
      id: 2,
      sender: 'Bob Smith',
      content: 'Reminder: Our meeting is scheduled for tomorrow at 10 AM.',
      programDate: '2024-08-06',
      time: '03:45 PM',
      details: 'Detailed information about Bob’s reminder.',
      read: false
    },
    {
      id: 3,
      sender: 'Carol Davis',
      content: 'I have uploaded the final version of the report.',
      programDate: '2024-08-05',
      time: '11:00 AM',
      details: 'Detailed information about Carol’s report.',
      read: false
    },
    {
      id: 4,
      sender: 'Dave Wilson',
      content: 'Please complete your feedback on the proposal by the end of the day.',
      programDate: '2024-08-04',
      time: '02:30 PM',
      details: 'Detailed information about Dave’s feedback request.',
      read: false
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (message) => {
    // Mark the message as read
    setMessages(messages.map(msg => 
      msg.id === message.id ? { ...msg, read: true } : msg
    ));
    setSelectedMessage(message);
  };

  return (
    <div className="p-4  w-full h-screen overflow-auto">
      {messages.map((message) => (
        <InboxMessage
          key={message.id}
          message={message}
          onClick={handleMessageClick}
        />
      ))}

      {selectedMessage && (
        <Dialog open={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
              <Dialog.Title className="text-xl font-semibold mb-4">{selectedMessage.sender}</Dialog.Title>
              <p className="mb-4">{selectedMessage.content}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  <span>{selectedMessage.programDate}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{selectedMessage.time}</span>
                </div>
              </div>
              <p>{selectedMessage.details}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setSelectedMessage(null)}
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
