import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "../contexts/AuthContext";
import Logo from "../assets/Logo.svg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Track", path: "/track" },
  { name: "Quick Log", path: "/quick" },
  { name: "Recipes", path: "/ingredients" },
  { name: "Goals", path: "/goals" },
  { name: "History", path: "/history" },
  { name: "Stats", path: "/stats" },
];

const Navbar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = UserAuth();
  const location = useLocation();

  // Fetch user profile
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const firestore = getFirestore();
      const userDoc = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    };
    fetchData();
  }, [user]);

  // Handle scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const handleSignOut = () => {
    logOut();
    setIsDropdownOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-navbar
        transition-all duration-normal ease-out-expo
        ${isScrolled
          ? 'bg-cream/85 backdrop-blur-nav shadow-md'
          : 'bg-cream'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img
              src={Logo}
              alt="BiteBalance"
              className="h-9 w-auto transition-transform duration-fast group-hover:scale-105"
            />
            <span className="font-display font-bold text-xl text-charcoal hidden sm:block">
              BiteBalance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-4 py-2
                    font-medium text-sm
                    transition-colors duration-fast
                    rounded-lg
                    ${isActive
                      ? 'text-coral'
                      : 'text-warm-gray hover:text-charcoal hover:bg-sand/50'
                    }
                  `}
                >
                  {link.name}
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-coral rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-warm-gray hover:text-charcoal hover:bg-sand rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                  flex items-center gap-2
                  p-1.5
                  rounded-full
                  transition-all duration-fast
                  hover:ring-2 hover:ring-coral/20
                  ${isDropdownOpen ? 'ring-2 ring-coral/30' : ''}
                `}
              >
                <img
                  src={userProfile?.profile_picture || "https://via.placeholder.com/32"}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-sand"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="
                    absolute right-0 top-full mt-2
                    w-56
                    bg-white
                    rounded-xl
                    shadow-xl
                    border border-sand
                    overflow-hidden
                    animate-fade-in-down
                    origin-top-right
                  "
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-sand bg-sand/30">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {userProfile?.name || user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-warm-gray truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="
                        flex items-center gap-3 px-4 py-2.5
                        text-sm text-charcoal
                        hover:bg-coral-light
                        transition-colors
                      "
                    >
                      <svg className="w-4 h-4 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="
                        w-full flex items-center gap-3 px-4 py-2.5
                        text-sm text-error
                        hover:bg-error-light
                        transition-colors
                      "
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-sand bg-cream animate-fade-in-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block px-4 py-3
                    font-medium text-sm
                    rounded-lg
                    transition-colors
                    ${isActive
                      ? 'bg-coral-light text-coral'
                      : 'text-charcoal hover:bg-sand'
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
