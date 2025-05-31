import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import apiPaths from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);  // Set loading initially to true

  useEffect(() => {
    // If the user is already set (after successful login), skip fetching
    if (User) return;

    // Retrieve the token from localStorage
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);  // No token found, set loading to false and exit
      return;
    }

    // Function to fetch user data using the stored token
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(apiPaths.auth.profile, {
          headers: { Authorization: `Bearer ${accessToken}` }, // Include token in headers
        });
        setUser(response.data); // Set user data if API request is successful
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();  // If there's an error fetching the user, clear the user state
      } finally {
        setLoading(false);  // Set loading to false after the request is done
      }
    };

    fetchUser();  // Call the fetchUser function to get user data
  }, [User]);  // Empty dependency array to ensure this runs only once on mount

  // Update user state and store token in localStorage
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Store the new token in localStorage
    setLoading(false);  // Set loading to false after updating user
  };

  // Clear user state and remove token from localStorage on logout or error
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");  // Remove token from localStorage
  };

  return (
    <UserContext.Provider value={{ User, Loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
