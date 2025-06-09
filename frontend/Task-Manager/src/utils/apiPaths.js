export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API endpoint paths
export const apiPaths = Object.freeze({
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    getuserprofile: `${API_BASE_URL}/api/auth/getuserprofile`,
    updateuserprofile: `${API_BASE_URL}/api/auth/updateuserprofile`,
  },
  users: {
    getAllUsers: `${API_BASE_URL}/api/users`,
    // Dynamically fetch a user by ID
    getUserById: (userId) => `${API_BASE_URL}/api/user/${userId}`,
  },
  tasks: {
    getAllTasks: `${API_BASE_URL}/api/tasks`,
    // Dynamically fetch, update, or delete a task by ID
    getTaskById: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    createTask: `${API_BASE_URL}/api/tasks`,
    updateTask: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    deleteTask: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    updateTaskStatus: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/status`,
    updateTaskChecklist: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/todo`,
    dashboardData: `${API_BASE_URL}/api/tasks/dashboard-data`,
    userDashboardData: `${API_BASE_URL}/api/tasks/user-dashboard-data`,
  },
  reports: {
    exportTasks: `${API_BASE_URL}/api/reports/export/tasks`,
    exportUsers: `${API_BASE_URL}/api/reports/export/users`,
  },
});

export default apiPaths;
