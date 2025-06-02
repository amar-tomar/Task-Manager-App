import React from "react";
import Progress from "../layout/progress";
import AvatarGroup from "../layout/AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div
      className='bg-white rounded-xl py-4 mt-4 shadow-lg shadow-gray-100 border border-gray-200/50 cursor-pointer'
      onClick={onClick}
    >
      {/* Status & Priority Tags */}
      <div className='flex items-end gap-3 px-4'>
        <div
          className={`text-[.6875rem] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
        <div
          className={`text-[.6875rem] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
      </div>

      {/* Title, Description & Progress */}
      <div
        className={`px-4 border-l-[.1875rem] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-4'>
          {title}
        </p>
        <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
          {description}
        </p>
        <p className='text-[13px] font-medium text-gray-700/80 mt-4 mb-2 leading-[18px]'>
          Task Done:{" "}
          <span className='font-semibold text-gray-700'>
            {completedTodoCount}/{todoChecklist?.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      {/* Footer: Dates, Avatars & Attachments */}
      <div className='px-4 mt-3'>
        <div className='flex items-center justify-between my-1'>
          <div className='text-xs text-gray-500'>
            <label>Start Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {moment(createAt).format("DD MMM YYYY")}
            </p>
          </div>
          <div className='text-xs text-gray-500'>
            <label>Due Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {moment(dueDate).format("DD MMM YYYY")}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between mt-3'>
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
              <LuPaperclip className='text-blue-500' />
              <span className='text-xs text-gray-900'>{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
