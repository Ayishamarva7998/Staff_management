import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MdClose } from 'react-icons/md';
import { RingLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const DeleteDialog = ({ isOpen, onClose, onConfirm, item, type }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(item, type);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg relative">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose className="h-6 w-6" aria-hidden="true" />
          </button>
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </Dialog.Title>
          <p className="mt-2 text-gray-600">Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 flex items-center"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? <RingLoader size={24} color="#ffffff" /> : 'Confirm Delete'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
