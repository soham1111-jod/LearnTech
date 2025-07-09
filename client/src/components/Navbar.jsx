import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import config from '../data/config.json';

const isAdmin = !!localStorage.getItem('admin_token'); 
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Concept Videos', path: '/videos' },
  { name: 'Projects Videos', path: '/projects' },
  { name: 'Live Projects', path: '/student-projects' },
  { name: 'Playlists', path: '/playlists' },
  { name: 'About', path: '/about' },
  ...(isAdmin ? [{ name: 'Admin Panel', path: '/admin' }] : []),
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determine if we're on the homepage
  const isHome = location.pathname === '/';

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={
        isHome
          ? "absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/60 to-transparent"
          : "sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/15 shadow-lg shadow-black/20"
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18">
          {/* Logo and Site Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
              <span className="text-white font-bold text-lg">LT</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
              LearnTech
            </span>
          </Link>
          {/* Desktop Nav (hidden below lg) */}
          <div className="hidden lg:flex space-x-2 items-center">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2.5 rounded-full font-medium text-base transition-all duration-300 relative group
                  ${location.pathname === link.path
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-indigo-600 before:to-purple-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100'
                    : 'text-gray-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/10 backdrop-blur-sm'}`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                )}
              </Link>
            ))}
            <div className="w-px h-6 bg-white/20 mx-3"></div>
            <a
              href={config.resourcesFolderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full font-medium text-base bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
            >
              Resources
            </a>
          </div>
          {/* Hamburger for mobile and tablet (below lg) */}
          <button
            className={`flex lg:hidden items-center px-3 py-2 rounded-xl transition-all duration-300 focus:outline-none z-50 relative ${mobileOpen ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25' : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'}`}
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="relative w-6 h-6 flex items-center justify-center">
              {/* Hamburger/Cross icon with animation */}
              <span
                className={`block absolute h-0.5 w-5 bg-white rounded transition-all duration-300 ease-in-out
                  ${mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-5 bg-white rounded transition-all duration-300 ease-in-out
                  ${mobileOpen ? 'opacity-0' : 'opacity-100'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-5 bg-white rounded transition-all duration-300 ease-in-out
                  ${mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}
              ></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Menu & Backdrop - Separate from navbar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop Overlay - starts below navbar */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            style={{ top: '72px' }} // 72px = h-18 (4.5rem)
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide-in Menu - wider on tablet */}
          <div
            className={`absolute top-18 right-0 h-[calc(100vh-4.5rem)] w-80 sm:w-96 bg-black/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-50
              ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex flex-col space-y-2 p-6 pt-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-6 py-4 rounded-full font-medium text-lg transition-all duration-300 relative group
                    ${location.pathname === link.path
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/10'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location.pathname === link.path && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  )}
                </Link>
              ))}
              <div className="h-px bg-white/20 mx-6 my-4"></div>
              <a
                href={config.resourcesFolderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 rounded-full font-medium text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Resources
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}