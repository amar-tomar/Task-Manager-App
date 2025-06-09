import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import CreateTask from "./pages/Admin/CreateTask";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import { Toaster } from "react-hot-toast";
import ManageUsers from "./pages/Admin/ManageUsers";
import Home from "./pages/Homepage/Home";
import { UserContext } from "./context/UserContext";
import UserProvider from "./context/UserProvider";
import ManageTasks from "./pages/Admin/ManageTasks ";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/admin-dashboard' element={<Dashboard />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>

            {/* Protected User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path='/user/user-dashboard' element={<UserDashboard />} />
              <Route path='/user/my-tasks' element={<MyTasks />} />
              <Route
                path='/user/task-details/:id'
                element={<ViewTaskDetails />}
              />
            </Route>

            {/* Default entry point */}
            <Route path='/' element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Add a fallback spinner if needed
  }

  // If no user, go to home page
  if (!user) {
    return <Navigate to='/home' />;
  }

  // If user is an admin
  if (user.role === "admin") {
    return <Navigate to='/admin/admin-dashboard' />;
  }

  // If user is a regular user
  return <Navigate to='/user/user-dashboard' />;
};
