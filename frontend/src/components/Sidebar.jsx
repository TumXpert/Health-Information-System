import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, X, Menu, FileText } from 'lucide-react'; // Added FileText icon
import logo from '../assets/logo.png';
import './Sidebar.css';

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

  // New function to handle report generation
  const handleGenerateReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/generate');
      const data = await response.json();

      if (data && data.data) {
        const blob = new Blob([data.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'enrollment_report.csv';
        link.click();

        URL.revokeObjectURL(url);
      } else {
        alert('No report data available.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    }
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

          {/* Generate Report Button */}
          <li className="nav-item mt-3">
            <button
              className="btn btn-outline-primary w-100"
              onClick={handleGenerateReport}
            >
              {collapsed ? <FileText size={20} /> : 'Generate Report'}
            </button>
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
