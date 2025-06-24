import React from 'react';

const Modal: React.FC = () => (
  <div className="fixed inset-0 z-50 hidden">
    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Modal Title</h3>
            <button className="btn btn-outline p-2 h-auto w-auto">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Modal body content goes here.
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
