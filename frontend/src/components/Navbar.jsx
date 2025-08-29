import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isEmail, setIsEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setIsEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    setIsEmail(""); // reset state
    navigate("/");  // redirect to homepage
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-10 py-2 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              SmartRecruit
            </span>
          </div>

          {/* Right side buttons */}
          {isEmail ? (
            <div className="flex items-center space-x-4">
              <Link to={"/dashboard"}>
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                type="button"
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to={"/login"}>
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/signup"}>
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
