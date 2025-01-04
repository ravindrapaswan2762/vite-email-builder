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

import Builder from './components/Builder';
import Navbar from './components/Navbar';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  const { selectedTemplate } = useSelector( (state) => state.menubar );

  return (
 
      <Router>
        {selectedTemplate ? (
          <div className="App">
            <Navbar />
            <Builder />
            <ToastContainer />
          </div>
        ) : 
          (
          <div className="flex h-screen">
            <MenuBarLandingPage />
            <RightSidePanel />
          </div>
          )
        }
      </Router>

  );
}

export default App;



