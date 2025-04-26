import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Retrieve saved dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  return (
    <div>
      {/* Pass down setDarkMode to Sidebar */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}  
      />
      
      {/* Sidebar Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="btn btn-outline-secondary position-fixed top-0 start-0 m-2"
          style={{ zIndex: 1060 }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Main content */}
      <div
        className="p-4"
        style={{
          marginLeft: isOpen && window.innerWidth > 768 ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
