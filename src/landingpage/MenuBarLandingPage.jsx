import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, handleMenuItemClick } from '../redux/menubarSlice';
import { FaBars, FaChevronLeft } from 'react-icons/fa'; // Hamburger and Close Icons

function MenuBarLandingPage() {
  const dispatch = useDispatch();
  const { isOpen, selectedMenuItem } = useSelector((state) => state.menubar);

  const toggleSidebarHandler = () => {
    dispatch(toggleSidebar()); // Toggle sidebar open/close
  };

  const handleMenuItemClickHandler = (item) => {
    dispatch(handleMenuItemClick(item)); // Set the selected menu item in the state
  };

  return (
    <div
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } bg-gray-800 text-white flex flex-col h-screen transition-all duration-300 ease-in-out p-4 shadow-lg fixed left-0 top-0 z-10`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-semibold ${isOpen ? 'block' : 'hidden'}`}>Dashboard</h1>
        <button
          onClick={toggleSidebarHandler}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="space-y-6">

        <li
          onClick={() => handleMenuItemClickHandler('templates')}
          className={`cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition duration-300 ${
            selectedMenuItem === 'landingPage' ? 'bg-gray-600' : ''
          }`}
        >
          <span className={`${!isOpen && 'hidden'} text-lg font-semibold`}>Templates</span>
        </li>




        <li
          onClick={() => handleMenuItemClickHandler('module')}
          className={`cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition duration-300 ${
            selectedMenuItem === 'landingPage' ? 'bg-gray-600' : ''
          }`}
        >
          <span className={`${!isOpen && 'hidden'} text-lg font-semibold`}>Module</span>
        </li>
        <li
          onClick={() => handleMenuItemClickHandler('settings')}
          className={`cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition duration-300 ${
            selectedMenuItem === 'settings' ? 'bg-gray-600' : ''
          }`}
        >
          <span className={`${!isOpen && 'hidden'} text-lg font-semibold`}>Settings</span>
        </li>
        <li
          onClick={() => handleMenuItemClickHandler('user')}
          className={`cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition duration-300 ${
            selectedMenuItem === 'users' ? 'bg-gray-600' : ''
          }`}
        >
          <span className={`${!isOpen && 'hidden'} text-lg font-semibold`}>Users</span>
        </li>
      </ul>
    </div>
  );
}

export default MenuBarLandingPage;
