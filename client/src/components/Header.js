import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Calendar, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ cartItemsCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Perundurai Home Rentals
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded flex items-center ${
                window.location.pathname === '/' ? 'bg-blue-500' : 'hover:bg-blue-500'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Properties
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/cart"
                  className={`px-4 py-2 rounded flex items-center relative ${
                    window.location.pathname === '/cart' ? 'bg-blue-500' : 'hover:bg-blue-500'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/add-property"
                  className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium flex items-center hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  List Property
                </Link>
                
                <Link
                  to="/bookings"
                  className={`px-4 py-2 rounded flex items-center ${
                    window.location.pathname === '/bookings' ? 'bg-blue-500' : 'hover:bg-blue-500'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </Link>
                
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
