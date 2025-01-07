import React, { useState } from 'react';
import { toggleModal } from '../redux/menubarSlice';
import { useDispatch } from 'react-redux';
import { setTemplateData } from '../redux/addTemplateSlice';

import { setBuilder } from '../redux/addTemplateSlice';
import { clearState } from '../redux/cardDragableSlice';

function AddTemplatePopUp() {
  const dispatch = useDispatch();

  // Local state for the form inputs
  const [formData, setFormData] = useState({
    templateName: '',
    category: '',
    language: '',
    subject: '',
  });

  const [errors, setErrors] = useState({}); // State for tracking errors

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear the error for the field being edited
    }));
  };

  // Close the modal
  const closeModal = () => {
    dispatch(toggleModal());
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.templateName.trim()) newErrors.templateName = 'Template Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.language.trim()) newErrors.language = 'Language is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    return newErrors;
  };

  // Handle form submission
  const builderHandler = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Update errors state
      return;
    }
    console.log('builderHandler called:', formData);
    dispatch(setTemplateData(formData));
    dispatch(toggleModal());
    dispatch(setBuilder(true));
    dispatch(clearState());

  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50"
      onClick={closeModal} // Close when clicking outside
    >
      <div
        className="bg-white rounded-lg p-8 w-[600px]"
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
              className={`mt-1 p-2 w-full border ${
                errors.templateName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.templateName}
              onChange={(e) => handleInputChange('templateName', e.target.value)}
            />
            {errors.templateName && <p className="text-red-500 text-sm">{errors.templateName}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Category</label>
            <input
              type="text"
              placeholder="Enter category here"
              className={`mt-1 p-2 w-full border ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Language</label>
            <input
              type="text"
              placeholder="Enter language here"
              className={`mt-1 p-2 w-full border ${
                errors.language ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
            />
            {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Subject</label>
            <input
              type="text"
              placeholder="Enter subject here"
              className={`mt-1 p-2 w-full border ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
          </div>

          {/* Add Variable Button */}
          <div className="mb-4 flex justify-end">
            <button type="button" className="text-blue-600 hover:underline">
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
                onClick={builderHandler}
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
