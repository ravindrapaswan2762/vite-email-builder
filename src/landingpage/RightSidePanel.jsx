import React from 'react';
import { useSelector } from 'react-redux';
import Settings from './Settings';
import User from './User';
import TemplatesPage from './TemplatesPage';
import ModulePage from './ModulePage';

function RightSidePanel() {
  const { selectedMenuItem } = useSelector((state) => state.menubar);

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'templates':
        return <TemplatesPage />;
      case 'module':
        return <ModulePage />;
      case 'settings':
        return <Settings />;
      case 'user':
        return <User />;
      default:
        return <ModulePage />; // Default to LandingPage if no item is selected
    }
  };

  return (
    <div className="flex-1 ml-20 lg:ml-100 p-8 bg-gray-100">
      {renderContent()}
    </div>
  );
}

export default RightSidePanel;
