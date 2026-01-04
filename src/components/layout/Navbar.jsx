import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Sparkles, LayoutDashboard, LogOut, User, ChevronDown, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 glass-nav transition-all border-b border-white/20 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-slate-600">
              Stackify
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/explore" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Showcase</Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              // LOGGED IN VIEW
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-full transition-colors border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">{user.username}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase">My Account</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </Link>
                    
                    <Link 
                      to="/" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                       <Plus className="w-4 h-4" /> Create New Site
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // GUEST VIEW
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2 transition-colors">
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 transition-all hover:shadow-slate-900/40 hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;