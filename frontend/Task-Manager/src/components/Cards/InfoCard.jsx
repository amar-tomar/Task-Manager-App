import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <span className="text-xs md:text-sm text-gray-500">{label}</span>
        <div className="text-sm md:text-base font-semibold text-black">{value}</div>
      </div>
    </div>
  );
};

export default InfoCard;
