import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AllContext'

const Nav = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-white text-xl font-bold hover:text-pink-200 transition-colors duration-200">
              EPMS Dashboard
            </Link>
          </div>
          
          <div className="hidden md:block">
            <Link to="/dashboard/all-employees" className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              All employees
            </Link>
            <Link to="/dashboard/all-departments" className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              All departments
            </Link>
            <Link to="/dashboard/all-salaries" className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              All Salaries
            </Link>
            <Link to="/dashboard/reports" className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Reports
            </Link>
            <button
              onClick={handleLogoutClick}
              className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-white hover:text-pink-200 p-2 rounded-md">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/dashboard/all-employees" className="text-white hover:text-pink-200 block px-3 py-2 rounded-md text-base font-medium">
            All employees
          </Link>
          <Link to="/dashboard/all-departments" className="text-white hover:text-pink-200 block px-3 py-2 rounded-md text-base font-medium">
            All departments
          </Link>
          <Link to="/dashboard/all-salaries" className="text-white hover:text-pink-200 block px-3 py-2 rounded-md text-base font-medium">
            All Salaries
          </Link>
          <Link to="/dashboard/all-reports" className="text-white hover:text-pink-200 block px-3 py-2 rounded-md text-base font-medium">
            Reports
          </Link>
          <button
            onClick={handleLogoutClick}
            className="text-white hover:text-pink-200 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
