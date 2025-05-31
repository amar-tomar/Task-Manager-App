import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks ";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDahboard from "./pages/User/UserDahboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path='/user/user-dashboard' element={<UserDahboard />} />
              <Route path='/user/my-tasks' element={<MyTasks />} />
              <Route path='/Admin/create-task' element={<CreateTask />} />
              <Route
                path='/users/task-details/:id'
                element={<ViewTaskDetails />}
              />
            </Route>
            {/* Default Route */}
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
  const { User, loading } = useContext(UserContext);

  // Show loading spinner or placeholder while checking user state
  if (loading) return <Outlet />; // This renders any nested routes

  // If no user is authenticated, redirect to login
  if (!User) {
    return <Navigate to='/login' />;
  }

  // If user is authenticated, check role and redirect accordingly
  if (User.role === "admin") {
    return <Navigate to='/admin/dashboard' />;
  }

  // Otherwise, render the content for regular users
  return <Outlet />;
};
