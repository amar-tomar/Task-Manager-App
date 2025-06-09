import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/layout/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const InfoBox = ({ label, value }) => (
  <div className='mb-2'>
    <label className='text-xs font-medium text-slate-500'>{label}</label>
    <div className='text-sm font-medium'>{value || "N/A"}</div>
  </div>
);
const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className='flex items-center gap-3'>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={onChange}
        className='w-4 h-4 text-primary border-gray-300 rounded-sm bg-gray-100'
      />
      <label className='text-[13px]'>{text}</label>
    </div>
  );
};

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getTaskDetailsByID = useCallback(async () => {
    try {
      const response = await axiosInstance.get(apiPaths.tasks.getTaskById(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error Fetching Task:", error);
    }
  }, [id]);

  const updateTodoChecklist = async (index) => {
  if (
    !task ||
    !task.todoChecklist ||
    index < 0 ||
    index >= task.todoChecklist.length
  ) {
    console.error("Invalid checklist index or no task loaded.");
    return;
  }

  // Prepare updated checklist
  const updatedChecklist = task.todoChecklist.map((item, idx) =>
    idx === index ? { ...item, completed: !item.completed } : item
  );

  console.log("🚀 Updated checklist to send:", updatedChecklist);

  try {
    const response = await axiosInstance.put(
      apiPaths.tasks.updateTaskChecklist(id),
      { todoChecklist: updatedChecklist }
    );

    console.log("✅ Server response:", response.data);

    if (response.status === 200 && response.data?.task) {
      console.log("⚡️ Updated task from server:", response.data.task);
      console.log("🔍 assignedTo after update:", response.data.task.assignedTo);

      setTask(response.data.task); // update state only after success
    } else {
      console.error(
        "Checklist update failed: Unexpected response status",
        response.status
      );
    }
  } catch (error) {
    console.error("Checklist update error:", error);
  }
};


  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
  }, [id, getTaskDetailsByID]);

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className='card'>
        {task ? (
          <div className='grid grid-cols-1 mt-4'>
            <div className='form-card col-span-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-sm md:text-xl font-medium'>{task.title}</h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task.status}
                </div>
              </div>

              <div className='mt-4'>
                <InfoBox label='Description' value={task.description} />
              </div>

              <div className='grid grid-cols-12 gap-4 mt-4'>
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label='Priority' value={task.priority} />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <InfoBox
                    label='Due Date'
                    value={
                      task.dueDate
                        ? moment(task.dueDate).format("DD-MM-YYYY")
                        : "N/A"
                    }
                  />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-500'>
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task.assignedTo?.map((item) => item.profileImageUrl) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div>
                <label className='text-xs font-medium text-slate-600'>
                  Todo Checklist
                </label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item?.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center text-slate-600 mt-10'>
            Loading task details...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
