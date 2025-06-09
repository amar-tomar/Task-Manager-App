// src/components/Cards/UserCard.jsx
import React from "react";

const UserCard = ({ name, email, profileImageUrl, statusCounts }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-3 w-90  lg:w-74 ">
      <div className="flex items-center gap-3">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-base font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <div className="flex flex-col items-center">
          <span className="text-blue-500 font-semibold">{statusCounts.pending}</span>
          <span>Pending</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-500 font-semibold">{statusCounts.inProgress}</span>
          <span>In Progress</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-purple-500 font-semibold">{statusCounts.completed}</span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
