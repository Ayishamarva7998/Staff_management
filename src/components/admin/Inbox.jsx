'use client'

import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const notificationsData = [
  { id: 1, title: 'New Message', description: 'You have received a new message from John.', read: false },
  { id: 2, title: 'Meeting Update', description: 'Your latest  updated on youre softwear.', read: true },
]

export default function Inbox() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const openModal = (notification) => {
    // Mark notification as read when opening modal
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    )
    setSelectedNotification(notification)
  }

  const closeModal = () => {
    setSelectedNotification(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex justify-between items-center p-4 border rounded-lg ${
              notification.read ? 'bg-gray-100 opacity-60' : 'bg-blue-50'
            } shadow-sm cursor-pointer hover:bg-gray-50 transition-colors`}
            onClick={() => openModal(notification)}
          >
            <div className="font-semibold text-lg">{notification.title}</div>
            <div className={`text-sm ${notification.read ? 'text-gray-500' : 'text-blue-500'}`}>
              {notification.read ? 'Read' : 'New'}
            </div>
          </div>
        ))}
      </div>

      {selectedNotification && (
        <Dialog open={!!selectedNotification} onClose={closeModal} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-out"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-500 ease-out sm:max-w-4xl sm:w-full sm:h-full"
              enter="transform scale-90 opacity-0"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="transform scale-100 opacity-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <ExclamationTriangleIcon aria-hidden="true" className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <DialogTitle as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                      {selectedNotification.title}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-lg text-gray-500">{selectedNotification.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Close
                </button>
                {!selectedNotification.read && (
                  <button
                    type="button"
                    onClick={() => {
                      // Mark the notification as read and close the modal
                      setNotifications(
                        notifications.map((n) =>
                          n.id === selectedNotification.id ? { ...n, read: true } : n
                        )
                      )
                      closeModal()
                    }}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:mt-0 sm:w-auto"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  )
}
