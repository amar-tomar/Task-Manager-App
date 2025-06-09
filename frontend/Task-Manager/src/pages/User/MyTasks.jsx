import { useEffect, useState, useCallback } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/layout/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import Login from './../Auth/Login';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(apiPaths.tasks.getAllTasks, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks|| 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className='card'>
        <div className='flex flex-col lg:flex-row md:items-center justify-between gap-3'>
          <h2 className='text-xl lg:text-xl font-medium'>My Tasks</h2>
          {tabs.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {loading ? (
          <div className='mt-4 text-center text-gray-600'>Loading tasks...</div>
        ) : error ? (
          <div className='mt-4 text-center text-red-500'>{error}</div>
        ) : allTasks.length > 0 ? (
          <div className='mt-4 space-y-4'>
            {allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo?.map(
                  (user) => user.profileImageUrl
                )}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={task.todoChecklist?.filter((item) => item.completed).length || 0 }
                todoChecklist={task.todoChecklist || []}
                onClick={() => handleClick(task._id)}
              />
            ))}
          </div>
        ) : (
          <div className='mt-4 text-center text-gray-500'>No tasks found.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
