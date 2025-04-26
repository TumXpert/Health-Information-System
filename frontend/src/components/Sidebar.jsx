import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, X, Menu } from 'lucide-react';
import logo from '../assets/logo.png'; // <-- make sure you have your logo here
import './Sidebar.css'; // <-- we'll create this css for transitions

export default function Sidebar({ isOpen, toggleSidebar, darkMode, setDarkMode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.body.classList.remove('bg-dark', 'text-light');
    }
  }, [darkMode]);

  const handleDarkModeChange = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'fw-bold bg-primary text-white' : 'text-reset'} custom-nav-link`;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {isOpen && window.innerWidth <= 768 && (
        <div
          onClick={toggleSidebar}
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
        />
      )}

      <div
        className={`position-fixed top-0 start-0 h-100 sidebar ${
          darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'
        } border-end shadow`}
        style={{
          width: collapsed ? '80px' : isOpen ? '250px' : '0',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          zIndex: 1050,
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          {!collapsed && (
            <span className="fs-5 fw-bold d-flex align-items-center">
              <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
              HealthInfoSys
            </span>
          )}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-outline-secondary me-2 d-none d-md-inline"
              onClick={toggleCollapse}
            >
              <Menu size={18} />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary d-md-none"
              onClick={toggleSidebar}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <ul className="nav nav-pills flex-column p-3">
          <li className="nav-item">
            <NavLink to="/" className={navLinkClass} onClick={toggleSidebar}>
              {collapsed ? '🏠' : 'Dashboard'}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/clients" className={navLinkClass} onClick={toggleSidebar}>
              {collapsed ? '👤' : 'Clients'}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/programs" className={navLinkClass} onClick={toggleSidebar}>
              {collapsed ? '📚' : 'Programs'}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/enrollments" className={navLinkClass} onClick={toggleSidebar}>
              {collapsed ? '📝' : 'Enrollments'}
            </NavLink>
          </li>
        </ul>

        <hr className="mx-3" />
        <div className="d-flex justify-content-between align-items-center px-3 pb-3">
          <small>{collapsed ? '' : 'Theme'}</small>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleDarkModeChange}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
