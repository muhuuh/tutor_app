import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiChevronDown } from 'react-icons/fi';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-semibold text-gray-900">
              Teacher Assistant
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link
              to="/home"
              className={`text-sm ${
                location.pathname === '/home'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1 text-sm ${
                  location.pathname.startsWith('/tools')
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tools
                <FiChevronDown className={`transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <Link
                    to="/tools/homework-corrections"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsToolsOpen(false)}
                  >
                    Homework Corrections
                  </Link>
                  <Link
                    to="/tools/exercise-forge"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsToolsOpen(false)}
                  >
                    Exercise Forge
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className={`text-sm ${
                location.pathname === '/pricing'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              className={`text-sm ${
                location.pathname === '/contact'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}