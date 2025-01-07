import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectTeplate } from '../redux/menubarSlice';

import { saveState } from '../redux/cardDragableSlice';

function ModulePage () {
  const [savedList, setSavedList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch saved list from the backend
    const fetchSavedList = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/saved');
        const data = await response.json();
        setSavedList(data);
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedList();
  }, []);

  const handleItemClick = (item) => {
    // Dispatch action for the clicked item
    dispatch(setSelectTeplate(item));
    dispatch(saveState(item.data));
  };

  const index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * index.length); // Get a random index
    return `https://picsum.photos/300/200?random=${index[randomIndex]}`; // Generate image URL
  };

  return (
    <div className="flex-1 ml-20 lg:ml-72 p-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedList.map((item) => (
            <div
              key={item._id}
              className="p-2 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:bg-gray-200 transition duration-300"
              onClick={() => handleItemClick(item)}
            >
              <img
                src={getRandomImage()}
                alt="Demo"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{item.templateName}</h3>
              <p className="text-gray-500 text-sm mt-2">Saved on {new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModulePage;
