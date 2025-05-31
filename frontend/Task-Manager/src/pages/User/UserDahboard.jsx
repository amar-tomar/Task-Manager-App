import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import useUserAuth from "../../hooks/useUserAuth"; // Assuming useUserAuth ensures that the user is authenticated
import DashboardLayout from "../../components/layout/DashboardLayout"; // Your layout component

const Dashboard = () => {
  useUserAuth(); // Custom hook to handle user authentication and redirection if necessary
  const { user } = useContext(UserContext); // Get user info from context

  if (!user) {
    return <div>Loading...</div>; // If user data isn't available, show loading state
  }

  return (
    <DashboardLayout> 
      <h1 className="text-3xl font-bold">Welcome to the User Dashboard</h1>
      <p>Welcome, {user.name}! You are logged in as an {user.role}.</p>
      {/* Add more content or components specific to the admin dashboard here */}
    </DashboardLayout>
  );
};

export default Dashboard;
