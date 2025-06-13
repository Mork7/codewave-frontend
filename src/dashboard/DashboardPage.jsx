import { useState, useEffect } from "react";
import axios from "axios";
import { useApiHost, useProfile } from "../hooks";
// Course Imports
import AllCourses from "./courses/AllCourses";
import AddCourseForm from "../forms/AddCourseForm";
// Student Imports
import AllStudents from "./students/AllStudents";
import AddNewUser from "../forms/AddNewUserForm";
// Instructor Imports
import AllInstructors from "./instructors/AllInstructors";
// Sidebar
import Sidebar from "./Sidebar";

function Dashboard() {
  const { API_HOST } = useApiHost();
  const [activeView, setActiveView] = useState("Welcome to the Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  // Pull 'role' and 'userData' from your Profile context (or your custom useProfile hook)
  const { role, userData } = useProfile();

  // We'll build userName on the fly from userData + role
  const [userName, setUserName] = useState("");

  // Fetch data for the active view
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeView === "Courses") {
          const response = await axios.get(`${API_HOST}/admin/courses`, {
            withCredentials: true,
          });
          sessionStorage.setItem("courses", JSON.stringify(response.data));
        } else if (activeView === "Students") {
          const response = await axios.get(`${API_HOST}/admin/students`, {
            withCredentials: true,
          });
          sessionStorage.setItem("students", JSON.stringify(response.data));
        } else if (activeView === "Instructors") {
          const response = await axios.get(`${API_HOST}/admin/instructors`, {
            withCredentials: true,
          });
          sessionStorage.setItem("instructors", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(
          `Error fetching ${activeView}:`,
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [API_HOST, activeView]);

  // Whenever userData or role changes, rebuild userName
  useEffect(() => {
    if (userData && role) {
      const capRole = role.charAt(0).toUpperCase() + role.slice(1);
      const nameStr = `${userData.first_name} ${userData.last_name} - ${capRole}`;
      setUserName(nameStr);
    } else {
      // If userData or role is null, clear name
      setUserName("");
    }
  }, [userData, role]);

  return (
    <div className="grid grid-rows-[1fr,10fr] grid-cols-[1fr,4fr] h-screen pt-16">
      {/* Header */}
      <div className="row-start-1 col-span-1 bg-gray-600 p-4 border-b-2 text-white font-bold text-xl flex items-center">
        {userName}
      </div>

      {/* Operations Bar */}
      <div className="row-start-1 col-span-1 bg-gray-200 p-5 flex items-center justify-between">
        <h2 className="font-bold text-xl">{activeView}</h2>

        {(activeView === "Students" ||
          activeView === "Courses" ||
          activeView === "Instructors") && (
          <input
            type="text"
            placeholder={`Filter ${activeView.toLowerCase()}...`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border border-gray-400 px-2 py-1 rounded"
          />
        )}
      </div>

      {/* Sidebar */}
      {role !== null ? (
        <Sidebar setActiveView={setActiveView} userRole={role} />
      ) : (
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 self-center ml-[40%]" />
      )}

      {/* Main Content */}
      <div className="row-start-2 col-start-2 font-bold overflow-y-scroll">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600" />
          </div>
        ) : (
          <section className="h-screen">
            {activeView === "Courses" && <AllCourses filterText={filterText} />}
            {activeView === "Add Course" && (
              <AddCourseForm setActiveView={setActiveView} />
            )}
            {activeView === "Students" && (
              <AllStudents filterText={filterText} />
            )}
            {activeView === "Add Student" && <AddNewUser role={"student"} />}
            {activeView === "Instructors" && (
              <AllInstructors filterText={filterText} />
            )}
            {activeView === "Add Instructor" && (
              <AddNewUser role={"instructor"} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
