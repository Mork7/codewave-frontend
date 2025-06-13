// MyNavbar.js
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useAuth, useProfile } from "../hooks/index.js"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const { isLoggedIn, logout, isLoading } = useAuth();
  const { userData, role } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) return null; // Avoid rendering the navbar content until loading is complete

  return (
    <Navbar className="absolute w-screen flex z-50 h-16">
      {/* Logo on the left */}
      <div className="flex hover:cursor-pointer absolute left-4">
        <Navbar.Brand href="/" className="">
          <img
            src="/login-logo.png"
            className="mr-3 h-6 sm:h-9"
            alt="Login Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Codewave Student Solutions
          </span>
        </Navbar.Brand>
      </div>

      {/* Links in the center */}
      <Navbar.Collapse className="flex mb-3 font-semibold absolute left-[43%] w-0">
        <div className="flex space-x-4">
          <Navbar.Link className="border-none" href="/">
            Home
          </Navbar.Link>
          <Navbar.Link className="border-none" href="/courses">
            Courses
          </Navbar.Link>
          <Navbar.Link className="border-none" href="/news">
            News
          </Navbar.Link>
          <Navbar.Link className="border-none" href="/contact">
            Contact
          </Navbar.Link>
        </div>
      </Navbar.Collapse>

      {/* Avatar or Login Button on the right */}
      <div className="text-black absolute right-4">
        {isLoggedIn ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                rounded
                className="h-12 w-12"
              />
            }
          >
            <Dropdown.Header className="text-black">
              <span className="block text-lg font-semibold">{`${userData?.first_name} ${userData?.last_name}`}</span>
              <span className="block truncate text-lg font-semibold">
                {userData?.email}
              </span>
            </Dropdown.Header>

            {/* Conditionally render Profile or Dashboard based on user role */}

            <Dropdown.Item
              className="text-black text-lg border-y-2 py-2 hover:bg-gray-100"
              href="/profile"
            >
              Profile
            </Dropdown.Item>

            {role === "student" && (
              <Dropdown.Item
                className="text-black text-lg py-2 border-b-2 hover:bg-gray-100"
                href="/schedule"
              >
                Schedule
              </Dropdown.Item>
            )}

            {role === "admin" && (
              <Dropdown.Item
                className="text-black text-lg py-2 border-b-2 hover:bg-gray-100"
                href="/dashboard"
              >
                Dashboard
              </Dropdown.Item>
            )}

            <Dropdown.Item
              className="text-black text-lg py-2"
              onClick={handleLogout}
            >
              Logout
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="button-base button-small"
          >
            Login
          </button>
        )}
      </div>
    </Navbar>
  );
}
