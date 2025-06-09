import React from "react";

const progress = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-900 bg-cyan-900 border border-cyan-900/10";
      case "Completed":
        return "text-indigo-900 bg-indigo-900 border border-indigo-900/20";
      default:
        return "text-violet-900 bg-violet-900 border border-violet-900/10";
    }
  };

  return (
    <div className='w-full bg-gray-200 rounded-full h-2'>
      <div
        className={`${getColor} h-2 rounded-full text-center text-xs font-medium`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default progress;
