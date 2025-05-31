export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiPaths = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    uploadImage: `${API_BASE_URL}/api/auth/upload-image`,
  },
  users: {
    getAllUsers: `${API_BASE_URL}/api/users`, // Fetch all users
    getUserById: (userId) => `${API_BASE_URL}/api/users/${userId}`, // Fetch user by ID

  },
  tasks: {
    getAllTasks: `${API_BASE_URL}/api/tasks`,
    getTaskById: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    createTask: `${API_BASE_URL}/api/tasks`,
    updateTask: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    deleteTask: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    updateTaskStatus: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/status`,
    updateTaskChecklist: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/checklist`,
    dashboardData: `${API_BASE_URL}/api/tasks/dashboard-data`,
    userDashboardData: `${API_BASE_URL}/api/tasks/user-dashboard-data`,
  },
  reports: {
    exportTasks: `${API_BASE_URL}/api/reports/export/tasks`,
    exportUsers: `${API_BASE_URL}/api/reports/export/users`,
  },
};

export default apiPaths;
