import React, { createContext, useState, useEffect, children } from "react";
import axiosInstance from "../utils/axiosInstance";
import apiPaths from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(apiPaths.auth.profile);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated",error);
        clearUser();
      }finally{
        setLoading(false);
      }
    };
    fetchUser();
  },[]);
   const updateUser = (userData) ={
    setUser(userData);
    localStorage.setItems("token"userData.token); // Save Token
    setLoading(false);
   }
};
