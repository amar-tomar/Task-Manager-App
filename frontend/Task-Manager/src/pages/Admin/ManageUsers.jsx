import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { LuFileSpreadsheet } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import UserCard from "../../components/Cards/UserCard";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get(apiPaths.users.getAllUsers);
      console.log("API Response:", data);

      // ✅ Map data to include statusCounts object for UI
      const updatedUsers = data.map((user) => ({
        ...user,
        statusCounts: {
          pending: user.pendingTasks || 0,
          inProgress: user.inProgressTasks || 0,
          completed: user.completedTasks || 0,
        },
      }));

      setUsers(updatedUsers || []);
    } catch (err) {
      console.error("Failed to load users:", err.response?.data || err.message);
      setError("Unable to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.reports.exportUsers, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users-report.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Team Member">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">My Users</h2>
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-5">
          {users.map((user) => (
            <UserCard
              key={user._id}
              name={user.name}
              email={user.email}
              profileImageUrl={user.profileImageUrl}
              statusCounts={user.statusCounts}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
