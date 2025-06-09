import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Input/SelectDropdown";
import SelectUsers from "../../components/Input/SelectUsers";
import TodoListInput from "../../components/Input/TodoListInput";
import AddAttachmentInput from "../../components/Input/AddAttachmentInput";
import moment from "moment";
import ManageTasks from "./ManageTasks ";

const initialTaskData = {
  title: "",
  description: "",
  priority: "low",
  dueDate: "",
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
};

const CreateTask = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const taskId = state?.taskId;

  const [taskData, setTaskData] = useState(initialTaskData);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearForm = () => {
    setTaskData(initialTaskData);
    setError("");
  };

  const validateTaskData = () => {
    if (!taskData.title.trim()) return "Title is required.";
    if (!taskData.description.trim()) return "Description is required.";
    if (!taskData.dueDate) return "Due date is required.";
    if (taskData.assignedTo.length === 0)
      return "Assign the task to at least one member.";
    if (taskData.todoChecklist.length === 0)
      return "Add at least one todo task.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateTaskData();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (taskId) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const formattedTodoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      const payload = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: formattedTodoList,
      };

      await axiosInstance.post(apiPaths.tasks.createTask, payload);

      toast.success("Task Created Successfully");
      clearForm();
      navigate("/admin/admin-dashboard"); // Adjust the path as needed
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const updatedTodoList = taskData.todoChecklist.map((item) => {
        const existingTodo = currentTask?.todoChecklist?.find(
          (task) => item.task === task
        );
        return {
          text: item,
          completed: existingTodo ? existingTodo.completed : false,
        };
      });

      const payload = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: updatedTodoList,
      };

      await axiosInstance.put(apiPaths.tasks.updateTask(taskId), payload);

      toast.success("Task Updated Successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetailsById = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        apiPaths.tasks.getTaskById(taskId)
      );
      const taskInfo = response.data;

      if (taskInfo) {
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  }, [taskId]);

  const deleteTask = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      await axiosInstance.delete(apiPaths.tasks.deleteTask(taskId));
      toast.success("Task Deleted Successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById();
    }
  }, [taskId, getTaskDetailsById]);

  return (
    <DashboardLayout activeMenu='Create Task'>
      <div className='mt-5'>
        <div className='grid grid-cols-3 md:grid-cols-2 mt-4'>
          <div className='form-card col-span-3 w-full'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-slate-800'>
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  type='button'
                  className='flex items-center gap-2 text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1.5 border border-rose-200 hover:border-rose-400 rounded-md transition'
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className='text-base' />
                  Delete
                </button>
              )}
            </div>

            <div className='mt-4'>
              <label
                htmlFor='title'
                className='text-xs font-medium text-slate-600'
              >
                Task Title
              </label>
              <input
                id='title'
                type='text'
                className='form-input'
                placeholder='Create App UI'
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            <div className='mt-3'>
              <label
                htmlFor='description'
                className='text-xs font-medium text-slate-600'
              >
                Description
              </label>
              <textarea
                id='description'
                className='form-input mt-1'
                rows={4}
                placeholder='Describe the task...'
                value={taskData.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            <div className='grid grid-cols-12 gap-4 mt-3'>
              <div className='col-span-6 md:col-span-4'>
                <label
                  htmlFor='priority'
                  className='text-xs font-medium text-slate-600'
                >
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder='Select Priority'
                />
              </div>
            </div>

            <div className='col-span-6 md:col-span-4 mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Due Date
              </label>
              <input
                type='date'
                className='form-input'
                value={taskData.dueDate}
                onChange={(e) => handleValueChange("dueDate", e.target.value)}
              />
            </div>

            <div className='col-span-12 md:col-span-3 mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Assign To
              </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) =>
                  handleValueChange("assignedTo", value)
                }
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Add Attachments
              </label>
              <AddAttachmentInput
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )}

            <div className='flex justify-end mt-7'>
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>

        {/* Optional: Confirm Delete Modal */}
        {openDeleteAlert && (
          <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
            <div className='bg-white p-5 rounded-md shadow-md text-center'>
              <p className='text-sm font-medium text-slate-800'>
                Are you sure you want to delete this task?
              </p>
              <div className='mt-4 flex justify-center gap-4'>
                <button
                  className='px-3 py-1.5 rounded-md text-sm text-white bg-rose-600 hover:bg-rose-700'
                  onClick={deleteTask}
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  className='px-3 py-1.5 rounded-md text-sm border text-slate-600 hover:bg-slate-100'
                  onClick={() => setOpenDeleteAlert(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
