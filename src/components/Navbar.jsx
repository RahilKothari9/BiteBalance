import Logo from "../assets/Logo.svg";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logOut } = UserAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const firestore = getFirestore();
      const userDoc = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log("No such documents.");
      }
    };

    fetchData();
  }, [user]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    logOut();
  };

  return (
    <nav className="fixed z-30 w-full bg-primary-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <a href="/" className="flex flex-row items-center ml-2 md:mr-24">
              <img src={Logo} className="h-8 mr-3" alt="Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                BiteBalance
              </span>
            </a>
          </div>
          {/* Profile */}
          <div className="flex items-center ml-3 relative">
            <button
              type="button"
              className="flex text-sm rounded-full focus:ring-4"
              onClick={handleToggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={userProfile ? userProfile.profile_picture : ""}
                alt="user photo"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 space-y-2 bg-white border dark:bg-gray-800 dark:border-gray-700 ring-1 ring-black ring-opacity-5 shadow-lg min-w-max mt-40">
                <li>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
