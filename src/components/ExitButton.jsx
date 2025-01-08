
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { setSelectTeplate } from "../redux/menubarSlice";
// import { setBuilder, setViewClick } from "../redux/addTemplateSlice";

// function ExitButton() {
//   const [showModal, setShowModal] = useState(false); // State for the confirmation modal
//   const dispatch = useDispatch();

//   const droppedItems = useSelector((state) => state.cardDragable.droppedItems);
//   const { templateName, category, subject, language, version, activeTemplateId} = useSelector(
//     (state) => state.addTemplate
//   );

//   // Handle saving as draft *************************************************************************
//   const handleSaveAsDraft = async () => {
//     const saveData = {
//       user_id: null,
//       templateName,
//       category,
//       subject,
//       language,
//       data: droppedItems,
//       version,
//       status: "Draft",

//       last_modified: new Date(),
//       last_modified_by: null,
//       module_id: null,
//       template_structure: null,
//       project_id: null,
//       business_id: null
//     };

//     console.log("saveData: ",saveData);

//     try {
//       const response = await fetch("http://localhost:5000/api/saveasdraft", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saveData),
//       });

//       if (response.ok) {
//         toast.success("Draft saved successfully!");
//         exitPage(); // Exit after saving
//       } else {
//         toast.error(response.error);
//       }
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       toast.error("An error occurred while saving the draft.");
//     }
//   };

//   // *****************************************************************************************

//   const updateDropedItems = async () => {
//       console.log("Updating data for template with ID:", activeTemplateId);
    
//       try {
//         const response = await fetch(`http://localhost:5000/api/updateDropedItems/${activeTemplateId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ data: droppedItems }), // Only send the `data` field
//         });
    
//         if (response.ok) {
//           toast.success("Data updated successfully!");
//           console.log("Item updated successfully");
//         } else {
//           console.error("Failed to update item");
//           toast.error("Failed to update item.");
//         }
//       } catch (error) {
//         console.error("Error updating item:", error);
//         toast.error("An error occurred while updating.");
//       }
//     };


//   // ***************************************************************************************************

//   // Handle exiting the page without saving
//   const exitPage = () => {
//     dispatch(setSelectTeplate(null));
//     dispatch(setBuilder(null));
//     dispatch(setViewClick(null));
//     setShowModal(false); // Close the modal
//   };

//   // Handle Exit Button Click
//   const handleExit = () => {
//     setShowModal(true); // Show the modal on exit button click
//   };

//   // ****************************************************************************************************

//   const onclickHandler = () => {
//     if(activeTemplateId ){
//       updateDropedItems();
//     }
//     else{
//       handleSaveAsDraft();
//     }
//   }


//   return (
//     <>
//       <button
//         onClick={handleExit}
//         className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
//       >
//         Exit
//       </button>

//       {/* Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg p-6 mt-20 shadow-lg w-[90%] max-w-sm">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Do you want to save your changes as a draft?
//             </h3>
//             <div className="flex justify-between">
//               <button
//                 onClick={onclickHandler}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//               >
//                 Save as Draft
//               </button>
//               <button
//                 onClick={exitPage}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
//               >
//                 Not Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default ExitButton;

// ***************************************************************************************************************************

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectTeplate } from "../redux/menubarSlice";
import { setBuilder, setViewClick } from "../redux/addTemplateSlice";

function ExitButton() {
  const [showModal, setShowModal] = useState(false); // State for the confirmation modal
  const dispatch = useDispatch();

  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);
  const { templateName, category, subject, language, version, activeTemplateId } = useSelector(
    (state) => state.addTemplate
  );

  // Handle saving as draft
  const handleSaveAsDraft = async () => {
    const saveData = {
      user_id: null,
      templateName,
      category,
      subject,
      language,
      data: droppedItems,
      version,
      status: "Draft",
      last_modified: new Date(),
      last_modified_by: null,
      module_id: null,
      template_structure: null,
      project_id: null,
      business_id: null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/saveasdraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        toast.success("Draft saved successfully!");
        exitPage(); // Exit after saving
      } else {
        toast.error("Failed to save draft.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("An error occurred while saving the draft.");
    }
  };

  // Update dropped items for an existing template
  const updateDropedItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/updateDropedItems/${activeTemplateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: droppedItems }), // Only send the `data` field
      });

      if (response.ok) {
        toast.success("Data updated successfully!");
      } else {
        console.error("Failed to update item");
        toast.error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("An error occurred while updating.");
    }
  };

  // Check the status of the template in the database
  const checkTemplateStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/templateStatus/${activeTemplateId}`);
      if (response.ok) {
        const { status } = await response.json();
        return status;
      } else {
        console.error("Failed to fetch template status");
        toast.error("Failed to fetch template status.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching template status:", error);
      toast.error("An error occurred while checking the template status.");
      return null;
    }
  };

  // Handle save or update based on status
  const onclickHandler = async () => {
    if (activeTemplateId) {
      const status = await checkTemplateStatus();
      if (status === "Draft") {
        updateDropedItems();
      } else {
        dispatch(setSelectTeplate(null));
        dispatch(setBuilder(null));
        dispatch(setViewClick(null));
      }
    } else {
      handleSaveAsDraft();
    }
  };

  // Handle exiting the page without saving
  const exitPage = () => {
    dispatch(setSelectTeplate(null));
    dispatch(setBuilder(null));
    dispatch(setViewClick(null));
    setShowModal(false); // Close the modal
  };

  // Handle Exit Button Click
  const handleExit = () => {
    setShowModal(true); // Show the modal on exit button click
  };

  return (
    <>
      <button
        onClick={handleExit}
        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Exit
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 mt-20 shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Do you want to save your changes as a draft?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={onclickHandler}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={exitPage}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExitButton;
