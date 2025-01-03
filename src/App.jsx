// =================================Original=================================-//
import React from 'react';
import Builder from './components/Builder';
import Navbar from './components/Navbar';
import SocialMedia from './components/domElements/SocialMedia';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="App">
      
      <Navbar />
      <Builder />
      <ToastContainer />
    </div>
  );
}

export default App;




