import { 
    LuLayoutDashboard, 
    LuUsers, 
    LuClipboardCheck, 
    LuSquarePlus, 
    LuLogOut 
  } from "react-icons/lu";
  
  // Admin Navigation Data
  export const adminNavData = [
    {
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/admin/dashboard"
    },
    {
      label: "Manage Tasks",
      icon: LuClipboardCheck,
      path: "/admin/tasks"
    },
    {
      label: "Create Task",
      icon: LuSquarePlus,
      path: "/admin/create-task"
    },
    {
      label: "Logout",
      icon: LuLogOut,
      path: "/logout"
    }
  ];
  
  // User Navigation Data
  export const userNavData = [
    {
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/user/dashboard"
    },
    {
      label: "My Tasks",
      icon: LuClipboardCheck,
      path: "/user/tasks"
    },
    {
      label: "Logout",
      icon: LuLogOut,
      path: "/logout"
    }
  ];
  
  // Priority Data
  export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" }
  ];
  
  // Status Data
  export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" }
  ];
  