import React, { useState } from "react";
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

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearForm = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
    setError("");
  };

  const validateTaskData = () => {
    if (!taskData.title.trim()) return "Title is required.";
    if (!taskData.description.trim()) return "Description is required.";
    if (!taskData.dueDate) return "Due date is required.";
    if (taskData.assignedTo.length === 0)
      return "Task is not assigned to any member.";
    if (taskData.todoChecklist.length === 0)
      return "Add at least one todo task.";
    return "";
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const formattedTodoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(apiPaths.tasks.createTask, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: formattedTodoList,
      });

      toast.success("Task Created Successfully");
      clearForm();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    // TODO: Implement update task logic
    toast("Update functionality is not implemented yet.");
  };

  const getTaskDetailsByID = async () => {
    // TODO: Implement fetching task details logic
  };

  const deleteTask = async () => {
    // TODO: Implement delete task logic
    setOpenDeleteAlert(false);
  };

  const handleSubmit = () => {
    const validationError = validateTaskData();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };

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

            {/* Title */}
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

            {/* Description */}
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

            {/* Priority */}
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

            {/* Due Date */}
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

            {/* Assign To */}
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

            {/* TODO Checklist */}
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

            {/* Attachments */}
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

            {/* Error */}
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
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
