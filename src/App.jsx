// // =================================Original=================================-//
// import React from 'react';
// import Builder from './components/Builder';
// import Navbar from './components/Navbar';
// import SocialMedia from './components/domElements/SocialMedia';
// import { ToastContainer, toast } from 'react-toastify';
// import LandingPage from './components/LandingPage';

// function App() {
//   return (
//     <div className="App">
  
//       <Navbar />
//       <Builder />
//       <ToastContainer />

//     </div>
//   );
// }

// export default App;


// ****************************************************************************************
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuBarLandingPage from './landingpage/MenuBarLandingPage';
import RightSidePanel from './landingpage/RightSidePanel';
import { useSelector } from 'react-redux';

import Email_builder from './components/email_builder';

function App() {

  const { selectedTemplate } = useSelector( (state) => state.menubar );
  const { isBuilder, isEditer, isViewClick} = useSelector( (state) => state.addTemplate );


  return (
 
      <Router>

      {selectedTemplate && <Email_builder />}

      {isBuilder && <Email_builder />}

      {isViewClick && <Email_builder />}


      {!selectedTemplate && !isBuilder && !isViewClick && (
        <div className="flex h-screen">
          <MenuBarLandingPage />
          <RightSidePanel />
        </div>
      )}
      
      </Router>

  );
}

export default App;



