import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import apiPaths from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [Loading, setLoading] = useState(true); // Set loading initially to true

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(apiPaths.auth.profile, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array - run only on initial mount

  // Update user state and store token in localStorage
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Store the new token in localStorage
    setLoading(false); // Set loading to false after updating user
  };

  // Clear user state and remove token from localStorage on logout or error
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  return (
    <UserContext.Provider value={{ User, Loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
