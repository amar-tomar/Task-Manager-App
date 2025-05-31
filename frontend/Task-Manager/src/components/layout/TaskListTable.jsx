import React from 'react';
import moment from 'moment';

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-700 border border-cyan-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600 border border-red-300';
      case 'Medium':
        return 'bg-orange-100 text-orange-600 border border-orange-300';
      case 'Low':
        return 'bg-green-100 text-green-600 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-300';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="px-4 py-3 font-medium text-[13px]">Name</th>
            <th className="px-4 py-3 font-medium text-[13px]">Status</th>
            <th className="px-4 py-3 font-medium text-[13px]">Priority</th>
            <th className="px-4 py-3 font-medium text-[13px] hidden md:table-cell">Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-gray-500 text-center">
                No tasks available.
              </td>
            </tr>
          ) : (
            tableData.map((task) => (
              <tr key={task._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-[13px] text-gray-800 whitespace-nowrap line-clamp-1">
                  {task.title}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getStatusBadgeColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getPriorityBadgeColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-[13px] text-gray-700 whitespace-nowrap">
                  {moment(task.createdAt).format('Do MMM YYYY')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
