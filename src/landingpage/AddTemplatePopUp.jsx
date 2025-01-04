import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleModal } from '../redux/menubarSlice';

function AddTemplatePopUp() {
  const dispatch = useDispatch();

  // Close the modal when cross button or outside is clicked
  const closeModal = () => {
    dispatch(toggleModal());
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50"
      onClick={closeModal} // Close when clicking outside
    >
      <div
        className="bg-white rounded-lg p-8 w-[600px]" // Increased width
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Create Template</h3>
          <button
            className="text-gray-600 text-lg"
            onClick={closeModal} // Close modal on cross button click
          >
            &times;
          </button>
        </div>

        <form className="mt-4">
          {/* Template Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Template Name</label>
            <input
              type="text"
              placeholder="Enter template name here"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Subject</label>
            <input
              type="text"
              placeholder="Enter subject here"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add Variable Button (moved right after subject) */}
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Add Variable
            </button>
          </div>

          {/* Create Email Body Using */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">Create Email Body Using</p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="bg-gray-200 bold p-4 rounded-lg hover:bg-gray-300 w-32 text-blue-400 font-bold hover:bg-blue-400 hover:text-white"
              >
                Editor
              </button>
              <span className="text-gray-600">Or</span>
              <button
                type="button"
                className="bg-gray-200 bold p-4 rounded-lg hover:bg-gray-300 w-32 text-green-400 font-bold hover:bg-green-400 hover:text-white"
              >
                Builder
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTemplatePopUp;
