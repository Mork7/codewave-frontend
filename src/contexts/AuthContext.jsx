import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useApiHost } from "../hooks";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { API_HOST } = useApiHost();

  // Check if the user is logged in on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${API_HOST}/auth/verify`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [API_HOST]);

  /**
   * Logs in the user
   * @param {string} email
   * @param {string} password
   * @returns {object} response.data
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_HOST}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
      return response.data; // ✅ RETURN THE DATA
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        return error.response; // Return the full error response
      }

      return { error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user
   * @param {function} clearProfileData
   * @returns {void}
  */
  const logout = async (clearProfileData) => {
    try {
      await axios.post(
        `${API_HOST}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      if (clearProfileData) clearProfileData(); // Call ProfileContext's clear function
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
