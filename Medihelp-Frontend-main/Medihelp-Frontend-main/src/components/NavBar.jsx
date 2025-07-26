import { Link } from "react-router-dom";
import { FaBars, FaChevronDown, FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsServicesOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userData");
    navigate("/login");
    setIsUserMenuOpen(false);
    if (isOpen) toggleMenu(); // Close mobile menu if open
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 w-[95%] max-w-full sm:max-w-5xl shadow-lg z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200/20 dark:border-gray-800/20 rounded-full">
      <div className="px-1 py-0.5 sm:px-3 flex justify-between items-center">
        <div className="flex items-center overflow-visible">
          <img src="/logo.png" className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 -my-1 sm:-my-2 md:-my-3" />
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 dark:text-white focus:outline-none">
            <FaBars className="text-2xl" />
          </button>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 dark:text-white hover:text-cyan-500 transition-colors duration-200 px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50">
            Home
          </Link>

          <div className="relative">
            <button
              onClick={toggleServices}
              className="text-gray-600 dark:text-white hover:text-cyan-500 flex items-center space-x-1 focus:outline-none transition-colors duration-200 px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
            >
              <span>Services</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isServicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 dark:bg-black/90 backdrop-blur-md text-gray-800 dark:text-white rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-800/20">
                <Link
                  to="/symptom-checker"
                  className="block px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  onClick={() => setIsServicesOpen(false)}
                >
                  Symptom Checker
                </Link>
                <Link
                  to="/skin-diagnosis"
                  className="block px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  onClick={() => setIsServicesOpen(false)}
                >
                  Skin Diagnosis
                </Link>
                <Link
                  to="/first-aid"
                  className="block px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  onClick={() => setIsServicesOpen(false)}
                >
                  First Aid
                </Link>
                <Link
                  to="/education"
                  className="block px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  onClick={() => setIsServicesOpen(false)}
                >
                  Education
                </Link>
              </div>
            )}
          </div>

          <Link to="/find-doctor" className="text-gray-600 dark:text-white hover:text-cyan-500 transition-colors duration-200 px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50">
            Find Doctor
          </Link>
          <Link to="/find-clinic" className="text-gray-600 dark:text-white hover:text-cyan-500 transition-colors duration-200 px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50">
            Find Clinic
          </Link>

          <button
            onClick={toggleDarkMode}
            className="relative group p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              {isDarkMode ? (
                <FaSun className="w-4 h-4 animate-pulse" />
              ) : (
                <FaMoon className="w-4 h-4" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {localStorage.getItem("token") ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="text-gray-600 dark:text-white hover:text-cyan-500 rounded-full focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
              >
                <User className="h-6 w-6 cursor-pointer" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-black/90 backdrop-blur-md text-gray-800 dark:text-white rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-800/20">
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-white hover:text-cyan-500 transition-colors duration-200 px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50">
                Log in
              </Link>
              <Link to="/signup/patient">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md rounded-b-2xl border-t border-gray-200/20 dark:border-gray-800/20">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" className="text-gray-600 dark:text-white hover:text-cyan-500" onClick={toggleMenu}>
              Home
            </Link>

            <div className="w-full text-center">
              <button
                onClick={toggleServices}
                className="text-gray-600 dark:text-white hover:text-cyan-500 flex items-center justify-center space-x-1 w-full focus:outline-none"
              >
                <span>Services</span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isServicesOpen && (
                <div className="flex flex-col mt-2 space-y-2">
                  <Link
                    to="/symptom-checker"
                    className="text-gray-600 dark:text-white hover:text-cyan-500 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    Symptom Checker
                  </Link>
                  <Link
                    to="/skin-diagnosis"
                    className="text-gray-600 dark:text-white hover:text-cyan-500 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    Skin Diagnosis
                  </Link>
                  <Link
                    to="/first-aid"
                    className="text-gray-600 dark:text-white hover:text-cyan-500 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    First Aid
                  </Link>
                  <Link
                    to="/education"
                    className="text-gray-600 dark:text-white hover:text-cyan-500 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    Education
                  </Link>
                </div>
              )}
            </div>

            <Link to="/find-doctor" className="text-gray-600 dark:text-white hover:text-cyan-500" onClick={toggleMenu}>
              Find Doctor
            </Link>
            <Link to="/find-clinic" className="text-gray-600 dark:text-white hover:text-cyan-500">
              Find Clinic
            </Link>

            {localStorage.getItem("token") ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="text-gray-600 dark:text-white hover:text-cyan-500 rounded-full focus:outline-none"
                >
                  <User className="h-6 w-6 cursor-pointer" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-md shadow-lg">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-cyan-100 text-gray-600 dark:text-white hover:text-cyan-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-white hover:text-cyan-500" onClick={toggleMenu}>
                  Log in
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
