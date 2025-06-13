import { useState } from "react";
import PropTypes from "prop-types";

// Dynamic Arrow Icon
function ArrowIcon({ isOpen }) {
  return (
    <svg
      className={`w-6 h-6 ml-2 transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 01.707.293l5.996 6.001a1 1 0 01-1.416 1.414L10 5.414l-5.287 5.294A1 1 0 013.297 9.293l6-6A1 1 0 0110 3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Sidebar({ setActiveView, userRole }) {
  const [openPanel, setOpenPanel] = useState(null);

  const handleTogglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  // More vertical padding (py-4) + increased font size (text-lg)
  const titleClass =
    "flex w-full items-center justify-between text-white px-4 py-4 font-semibold text-lg hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200";

  const contentWrapperClass =
    "overflow-hidden transition-all duration-300 bg-gray-700";

  const contentButtonClass =
    "text-left text-white px-4 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-800 active:bg-gray-900 rounded-md";


  // Check if user is an admin, this isn't secure, just for the UI
  const isAdmin = userRole === "admin";

  return (
    <div className="bg-gray-600 text-sm font-semibold w-full">
      {/* -- Manage Courses Panel -- */}
      <div className="border-b border-gray-500">
        <button
          onClick={() => handleTogglePanel("courses")}
          className={`${titleClass}`}
          disabled={!isAdmin}
        >
          Manage Courses
          <ArrowIcon isOpen={openPanel === "courses"} />
        </button>
        <div
          className={`${contentWrapperClass} ${
            openPanel === "courses" ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-2 px-4 py-2">
            <button
              className={contentButtonClass}
              onClick={() => setActiveView("Courses")}
            >
              All Courses
            </button>
            <button
              className={contentButtonClass}
              onClick={() => setActiveView("Add Course")}
            >
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* -- Manage Students Panel -- */}
      <div className="border-b border-gray-500">
        <button
          onClick={() => handleTogglePanel("students")}
          className={`${titleClass}`}
          disabled={!isAdmin}
        >
          Manage Students
          <ArrowIcon isOpen={openPanel === "students"} />
        </button>
        <div
          className={`${contentWrapperClass} ${
            openPanel === "students" ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-2 px-4 py-2">
            <button
              className={contentButtonClass}
              onClick={() => setActiveView("Students")}
            >
              All Students
            </button>
            <button
              className={contentButtonClass}
              onClick={() => setActiveView("Add Student")}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Instructors */}
      <div className="border-b border-gray-500">
        <button
          onClick={() => isAdmin && handleTogglePanel("instructors")}
          disabled={!isAdmin} // if not admin, disable
          className={`${titleClass}`}
        >
          Manage Instructors
          <ArrowIcon isOpen={openPanel === "instructors"} />
        </button>
        <div
          className={`${contentWrapperClass} ${
            openPanel === "instructors" ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-2 px-4 py-2">
            <button
              onClick={() => isAdmin && setActiveView("Instructors")}
              disabled={!isAdmin}
              className={`${contentButtonClass}`}
            >
              All Instructors
            </button>
            <button
              onClick={() => isAdmin && setActiveView("Add Instructor")}
              disabled={!isAdmin}
              className={`${contentButtonClass}`}
            >
              Add Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

ArrowIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};
