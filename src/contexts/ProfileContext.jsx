import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useApiHost } from "../hooks";
import AuthContext from "./AuthContext"; // Import AuthContext to wait for auth state

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { API_HOST } = useApiHost();
  const { isLoggedIn, isLoading: authLoading } = useContext(AuthContext); // Wait for AuthContext

  /**
   * Fetch profile data from the server
   * and update the state with the response
   * @returns {Promise<void>}
   */
  const fetchProfileData = async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get(`${API_HOST}/auth/profile`, {
          withCredentials: true,
        });
        const { personal_info, student_courses, managed_courses } =
          response.data;

        // Strip out role from personal_info
        const { role, ...strippedInfo } = personal_info;
        
        // Set user data and role
        setUserData(strippedInfo);
        sessionStorage.setItem("userData", JSON.stringify(strippedInfo));
        setRole(role);
        
        // Get course data based on role
        const fetchedCourseData =
          (role == "student" && student_courses) ||
          (role == "instructor" && managed_courses) ||
          [];
        setCourseData(fetchedCourseData);
        sessionStorage.setItem("courseData", JSON.stringify(fetchedCourseData));
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Clear profile data from the state and session storage
   */
  const clearProfileData = () => {
    setUserData(null);
    setRole(null);
    setCourseData([]);
    sessionStorage.clear();
  };

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      fetchProfileData();
    } else if (!isLoggedIn) {
      clearProfileData(); // Clear profile data when logged out
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isLoggedIn]);

  return (
    <ProfileContext.Provider
      value={{
        userData,
        role,
        courseData,
        setCourseData,
        isLoading,
        clearProfileData,
        setUserData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileContext;
