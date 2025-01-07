// import React, { useState, useEffect } from 'react';
// import { Add, FilterList, Refresh, Search } from '@mui/icons-material';
// import { FaChevronDown } from "react-icons/fa";
// import { useSelector, useDispatch } from 'react-redux';
// import AddTemplatePopUp from './AddTemplatePopUp'; // Import the AddTemplatePopUp component
// import { toggleModal } from '../redux/menubarSlice'; // Assuming toggleModal is in menubarSlice
// import { BsThreeDots } from "react-icons/bs";



// const initialData = [
//   {
//     templateName: 'Test_MSG91_Test',
//     version: '1.0',
//     subject: 'Login OTP for MSG91 Account',
//     status: 'Pending',
//     category: 'Authentication',
//     language: 'English',
//   },
//   {
//     templateName: 'Test_MSG91',
//     version: '1.0',
//     subject: 'Login OTP for MSG91 Account',
//     status: 'Pending',
//     category: 'Authentication',
//     language: 'English',
//   },
//   {
//     templateName: 'Test_MSG91_Walkover',
//     version: '1.0',
//     subject: 'This is Test Subject Line for user ##VAR1##',
//     status: 'Verified',
//     category: 'Marketing',
//     language: 'English',
//   },
//   {
//     templateName: 'Test_MSG91_Rejected',
//     version: '1.0',
//     subject: 'This is a rejected template for MSG91',
//     status: 'Rejected',
//     category: 'Notification',
//     language: 'English',
//   },
// ];

// function TemplatesPage() {
//   const { isModalOpen } = useSelector((state) => state.menubar);
//   const dispatch = useDispatch();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [activeFilterTag, setActiveFilterTag] = useState(null);
//   const [isFilterClicked, setFilterClicked] = useState(false);
//   const [popupIndex, setPopupIndex] = useState(null);
//   const [data, setData] = useState([]);
//   const [editPopup, setEditPopup] = useState({ isOpen: false, index: null, item: null });


//   useEffect(() => {
//       // Fetch saved list from the backend
//       const fetchSavedList = async () => {
//         try {
//           const response = await fetch('http://localhost:5000/api/saved');
//           const jsonData = await response.json();
//           console.log("jsonData: ",jsonData);
//           setData(jsonData);
//         } catch (error) {
//           console.error('Error fetching saved data:', error);
//         }
//       };
  
//       fetchSavedList();
//   }, []);


//   const onClickHandler = () => {
//     dispatch(toggleModal());
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (status) => {
//     if (activeFilterTag === status) {
//       setActiveFilterTag(null);
//       setFilterStatus('All');
//     } else {
//       setActiveFilterTag(status);
//       setFilterStatus(status);
//     }
//   };

//   const filteredData = data.filter((row) => {
//     const matchesSearch =
//       row.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.subject.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'All' || row.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const togglePopup = (index) => {
//     setPopupIndex((prevIndex) => (prevIndex === index ? null : index));
//   };

//   const handlePopupAction = (action, index) => {
//     switch (action) {
//       case 'Edit':
//         setEditPopup({ isOpen: true, index, item: { ...data[index] } });
//         setPopupIndex(null);
//         break;
//       case 'Delete':
//         setData((prevData) => prevData.filter((_, i) => i !== index));
//         setPopupIndex(null);
//         break;
//       case 'Clone':
//         setData((prevData) => {
//           const clonedItem = { ...data[index], templateName: `${data[index].templateName}_Copy` };
//           return [...prevData, clonedItem];
//         });
//         setPopupIndex(null);
//         break;
//       case 'View':
//         alert(`View functionality for template: ${data[index].templateName}`);
//         setPopupIndex(null);
//         break;
//       default:
//         break;
//     }
//   };
  

//   const handleEditSave = (updatedItem) => {
//     setData((prevData) =>
//       prevData.map((item, index) => (index === editPopup.index ? updatedItem : item))
//     );
//     setEditPopup({ isOpen: false, index: null, item: null });
//   };
  

//   const handleOutsideClick = (e) => {
//     // if (!e.target.closest('.popup') && !e.target.closest('.popup-button')) {
//     //   setPopupIndex(null);
//     //   setEditPopup({ isOpen: false, index: null, item: null });
//     // }
//   };

//   useEffect(() => {
//     document.addEventListener('click', handleOutsideClick);
//     return () => {
//       document.removeEventListener('click', handleOutsideClick);
//     };
//   }, []);

//   return (
//     <div className="flex-1 ml-20 lg:ml-72 h-full bg-gray-100">
//       <div className="flex justify-between items-center rounded-lg mb-6">
//         <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
//           <Search className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search by template name or subject"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="ml-2 p-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex items-center space-x-4">
//           <button
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
//             onClick={onClickHandler}
//           >
//             <Add className="mr-2" />
//             Add Template
//           </button>
//           <div className="relative">
//             <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300" onClick={() => setFilterClicked(!isFilterClicked)}>
//               Filter <FilterList className="text-gray-600" />
//             </button>
//             {isFilterClicked && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                 <button
//                   className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => handleFilterChange('All')}
//                 >
//                   All
//                 </button>
//                 <button
//                   className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => handleFilterChange('Pending')}
//                 >
//                   Pending
//                 </button>
//                 <button
//                   className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => handleFilterChange('Verified')}
//                 >
//                   Verified
//                 </button>
//                 <button
//                   className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => handleFilterChange('Rejected')}
//                 >
//                   Rejected
//                 </button>
//               </div>
//             )}
//           </div>
//           <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
//             <Refresh className="text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {activeFilterTag && (
//         <div className="flex items-center space-x-2 mb-4">
//           <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
//             {activeFilterTag}
//             <button
//               className="ml-2 text-blue-600 font-bold"
//               onClick={() => handleFilterChange(activeFilterTag)}
//             >
//               &times;
//             </button>
//           </span>
//         </div>
//       )}

//       <div className="h-full bg-white p-4 rounded-lg shadow-md">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Template Name</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Category</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Language</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Version</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Subject</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Status</th>
//               <th className="py-2 px-4 font-bold text-sm text-gray-600">Edit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((row, index) => (
//               <tr key={index} className="border-b relative">
//                 <td className="py-4 px-4">
//                   {row.templateName} <span className="text-xs text-gray-400">v{row.version}</span>
//                 </td>
//                 <td className="py-4 px-4">{row.category}</td>
//                 <td className="py-4 px-4">{row.language}</td>
//                 <td className="py-4 px-4">{row.version}</td>
//                 <td className="py-4 px-4">{row.subject}</td>
//                 <td className="py-4 px-4">
//                   <span
//                     className={`font-bold ${
//                       row.status === 'Pending'
//                         ? 'text-orange-400'
//                         : row.status === 'Verified'
//                         ? 'text-blue-400'
//                         : 'text-red-400'
//                     }`}
//                   >
//                     {row.status}
//                   </span>
//                 </td>
                
//                 <td className="py-4 px-4 relative">
//                   <button
//                     className="hover:text-blue-800 popup-button"
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent triggering handleOutsideClick
//                       togglePopup(index);
//                     }}
//                   >
//                     <BsThreeDots />
//                   </button>
//                   {popupIndex === index && (
//                     <div
//                       className="popup absolute top-full left-0 -mt-2 w-20 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
//                     >
//                       <button
//                         className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                         onClick={() => handlePopupAction('Edit', index)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                         onClick={() => handlePopupAction('Delete', index)}
//                       >
//                         Delete
//                       </button>
//                       <button
//                         className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                         onClick={() => handlePopupAction('Clone', index)}
//                       >
//                         Clone
//                       </button>
//                       <button
//                         className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                         onClick={() => handlePopupAction('View', index)}
//                       >
//                         View
//                       </button>
//                     </div>
//                   )}
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {editPopup.isOpen && (
//         <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 edit-popup">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-4">Edit Template</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Template Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={editPopup.item.templateName}
//                 onChange={(e) =>
//                   setEditPopup((prev) => ({
//                     ...prev,
//                     item: { ...prev.item, templateName: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Category</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={editPopup.item.category}
//                 onChange={(e) =>
//                   setEditPopup((prev) => ({
//                     ...prev,
//                     item: { ...prev.item, category: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Language</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={editPopup.item.language}
//                 onChange={(e) =>
//                   setEditPopup((prev) => ({
//                     ...prev,
//                     item: { ...prev.item, language: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Version</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={editPopup.item.version}
//                 onChange={(e) =>
//                   setEditPopup((prev) => ({
//                     ...prev,
//                     item: { ...prev.item, version: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Subject</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={editPopup.item.subject}
//                 onChange={(e) =>
//                   setEditPopup((prev) => ({
//                     ...prev,
//                     item: { ...prev.item, subject: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div className="flex justify-end space-x-4">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-lg"
//                 onClick={() => setEditPopup({ isOpen: false, index: null, item: null })}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                 onClick={() => handleEditSave(editPopup.item)}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {isModalOpen && <AddTemplatePopUp />}
//     </div>
//   );
// }

// export default TemplatesPage;

// ***********************************************************************************************************

import React, { useState, useEffect } from 'react';
import { Add, FilterList, Refresh, Search } from '@mui/icons-material';
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import AddTemplatePopUp from './AddTemplatePopUp';
import { toggleModal } from '../redux/menubarSlice';
import { BsThreeDots } from "react-icons/bs";

import { setViewClick } from '../redux/addTemplateSlice';
import { saveState } from '../redux/cardDragableSlice';
import { setActiveTemplateId } from '../redux/addTemplateSlice';

function TemplatesPage() {
  const { isModalOpen } = useSelector((state) => state.menubar);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeFilterTag, setActiveFilterTag] = useState(null);
  const [isFilterClicked, setFilterClicked] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);
  const [data, setData] = useState([]);
  const [editPopup, setEditPopup] = useState({ isOpen: false, index: null, item: null });

  // Fetch data from the server
  useEffect(() => {
    const fetchSavedList = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/saved');
        const jsonData = await response.json();
        console.log("Fetched Data: ", jsonData);

        const mappedData = jsonData.map((item) => ({
          id: item._id,
          templateName: item.templateName || 'Unnamed Template',
          category: item.category || 'Uncategorized',
          language: item.language || 'Unknown',
          version: item.version || '1.0',
          subject: item.subject || 'No Subject',
          status: item.status || 'Pending',
          createdAt: item.createdAt,
          data: item.data,
        }));

        setData(mappedData);
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedList();
  }, []);

  const onClickHandler = () => {
    dispatch(toggleModal());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    if (activeFilterTag === status) {
      setActiveFilterTag(null);
      setFilterStatus('All');
    } else {
      setActiveFilterTag(status);
      setFilterStatus(status);
    }
  };

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || row.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const togglePopup = (index) => {
    setPopupIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        console.log("Template deleted successfully");
      } else {
        console.error("Failed to delete template");
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const saveHandler = async (updatedItem) => {
    try {
      const response = await fetch(`http://localhost:5000/api/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        const newItem = await response.json();
        setData((prevData) =>
          prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        console.log("Template updated successfully");
      } else {
        console.error("Failed to update template");
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handlePopupAction = (action, index) => {
    const item = data[index];
    switch (action) {
      case 'Edit':
        setEditPopup({ isOpen: true, index, item: { ...item } });
        setPopupIndex(null);
        break;
      case 'Delete':
        handleDelete(item.id);
        setPopupIndex(null);
        break;
      case 'Clone':
        const clonedItem = { ...item, templateName: `${item.templateName}_Copy`, id: undefined };
        saveHandler(clonedItem);
        setPopupIndex(null);
        break;
      case 'View':
        console.log("item: ", item);
        
        dispatch(saveState(item.data));
        dispatch(setViewClick(true));
        dispatch(setActiveTemplateId(item.id));

        setPopupIndex(null);
        break;
      default:
        break;
    }
  };

  const updateHandler = async (updatedItem) => {
    console.log("updatedItem: ",updatedItem);
    try {
      const response = await fetch(`http://localhost:5000/api/update/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      console.log("response: ", response);
  
      if (response.ok) {
        setData((prevData) =>
          prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        console.log("Item updated successfully");
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  
    setEditPopup({ isOpen: false, index: null, item: null });
  };
  

  return (
    <div className="flex-1 ml-20 lg:ml-72 h-full bg-gray-100">
      <div className="flex justify-between items-center rounded-lg mb-6">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by template name or subject"
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 p-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={onClickHandler}
          >
            <Add className="mr-2" />
            Add Template
          </button>
          <div className="relative">
            <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300" onClick={() => setFilterClicked(!isFilterClicked)}>
              Filter <FilterList className="text-gray-600" />
            </button>
            {isFilterClicked && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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

      <div className="h-full bg-white p-4 rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Template Name</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Category</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Language</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Version</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Subject</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Status</th>
              <th className="py-2 px-4 font-bold text-sm text-gray-600">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="py-4 px-4">{row.templateName}</td>
                <td className="py-4 px-4">{row.category}</td>
                <td className="py-4 px-4">{row.language}</td>
                <td className="py-4 px-4">{row.version}</td>
                <td className="py-4 px-4">{row.subject}</td>
                <td className="py-4 px-4">
                  <span
                    className={`font-bold ${
                      row.status === 'Pending'
                        ? 'text-orange-400'
                        : row.status === 'Verified'
                        ? 'text-blue-400'
                        : 'text-red-400'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 relative">
                  <button
                    className="hover:text-blue-800 popup-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePopup(index);
                    }}
                  >
                    <BsThreeDots />
                  </button>
                  {popupIndex === index && (
                    <div className="popup absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => handlePopupAction('Edit', index)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => handlePopupAction('Delete', index)}
                      >
                        Delete
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => handlePopupAction('Clone', index)}
                      >
                        Clone
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => handlePopupAction('View', index)}
                      >
                        View
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editPopup.isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 edit-popup">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Template</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPopup.item.templateName}
                onChange={(e) =>
                  setEditPopup((prev) => ({
                    ...prev,
                    item: { ...prev.item, templateName: e.target.value },
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPopup.item.category}
                onChange={(e) =>
                  setEditPopup((prev) => ({
                    ...prev,
                    item: { ...prev.item, category: e.target.value },
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPopup.item.language}
                onChange={(e) =>
                  setEditPopup((prev) => ({
                    ...prev,
                    item: { ...prev.item, language: e.target.value },
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Version</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPopup.item.version}
                onChange={(e) =>
                  setEditPopup((prev) => ({
                    ...prev,
                    item: { ...prev.item, version: e.target.value },
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPopup.item.subject}
                onChange={(e) =>
                  setEditPopup((prev) => ({
                    ...prev,
                    item: { ...prev.item, subject: e.target.value },
                  }))
                }
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setEditPopup({ isOpen: false, index: null, item: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => updateHandler(editPopup.item)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <AddTemplatePopUp />}
    </div>
  );
}

export default TemplatesPage;
