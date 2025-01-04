import React, { useState } from 'react';
import { Add, FilterList, Refresh, Search } from '@mui/icons-material';
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import AddTemplatePopUp from './AddTemplatePopUp'; // Import the AddTemplatePopUp component
import { toggleModal } from '../redux/menubarSlice'; // Assuming toggleModal is in menubarSlice

const demoData = [
  {
    templateName: 'Test_MSG91_Test',
    version: '1.0',
    subject: 'Login OTP for MSG91 Account',
    status: 'Pending',
  },
  {
    templateName: 'Test_MSG91',
    version: '1.0',
    subject: 'Login OTP for MSG91 Account',
    status: 'Pending',
  },
  {
    templateName: 'Test_MSG91_Walkover',
    version: '1.0',
    subject: 'This is Test Subject Line for user ##VAR1##',
    status: 'Verified',
  },
  {
    templateName: 'Test_MSG91_Rejected',
    version: '1.0',
    subject: 'This is a rejected template for MSG91',
    status: 'Rejected',
  },
];

function TemplatesPage() {
  const { isModalOpen } = useSelector((state) => state.menubar); // Accessing modal state from Redux
  const dispatch = useDispatch();

  // State for search, filter, and active filter tag
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // Default is 'All'
  const [activeFilterTag, setActiveFilterTag] = useState(null); // Track active filter
  const [isFilterClicked, setFilterClicked] = useState(false);

  // Toggle modal visibility
  const onClickHandler = () => {
    dispatch(toggleModal()); // Dispatch action to toggle modal visibility
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter tag click to toggle active filter
  const handleFilterChange = (status) => {
    if (activeFilterTag === status) {
      setActiveFilterTag(null); // Remove filter if already active
      setFilterStatus('All'); // Show all data if no filter
    } else {
      setActiveFilterTag(status); // Set the active filter tag
      setFilterStatus(status); // Set the filter status
    }
  };

  // Filtered data based on search and filter
  const filteredData = demoData.filter((row) => {
    // Filter by search term (case-insensitive search)
    const matchesSearch = row.templateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'All' || row.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filterButtonHandler = () => {
    setFilterClicked(!isFilterClicked);
  }

  return (
    <div className="flex-1 ml-20 lg:ml-72 h-full bg-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center rounded-lg mb-6">
        {/* Search Bar */}
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by template name or subject"
            value={searchTerm}
            onChange={handleSearchChange} // Handle search change
            className="ml-2 p-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={onClickHandler} // Open the modal
          >
            <Add className="mr-2" />
            Add Template
          </button>
          <div className="relative">
            <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300" onClick={filterButtonHandler}>
              Filter <FilterList className="text-gray-600" />
            </button>
            {/* Filter Dropdown */}
             {isFilterClicked && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleFilterChange('All')}
                >
                  All
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Pending')}
                >
                  Pending
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Verified')}
                >
                  Verified
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Rejected')}
                >
                  Rejected
                </button>
              </div>
             )}
          </div>
          <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <Refresh className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Active Filter Tag */}
      {activeFilterTag && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
            {activeFilterTag} 
            <button
              className="ml-2 text-blue-600 font-bold"
              onClick={() => handleFilterChange(activeFilterTag)} // Remove active filter
            >
              &times;
            </button>
          </span>
        </div>
      )}

      {/* Table Section */}
      <div className="h-full bg-white p-4 rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Template Name</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Subject</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Status</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-4">{row.templateName} <span className="text-xs text-gray-400">v{row.version}</span></td>
                <td className="py-4 px-4">{row.subject}</td>
                <td className="py-4 px-4">
                  <span
                    className={`font-bold ${
                      row.status === 'Pending' ? 'text-orange-400' : row.status === 'Verified' ? 'text-blue-400' : 'text-red-400'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="hover:text-blue-800"><FaChevronDown /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AddTemplatePopUp component */}
      {isModalOpen && <AddTemplatePopUp />} {/* Show modal if isModalOpen is true */}
    </div>
  );
}

export default TemplatesPage;
