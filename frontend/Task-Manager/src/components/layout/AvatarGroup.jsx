import React from "react";

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  const safeAvatars = Array.isArray(avatars) ? avatars : [];

  return (
    <div className='flex items-center'>
      {safeAvatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0'
          src={avatar}
          key={index}
          alt={`Avatar ${index}`}
        />
      ))}
      {safeAvatars.length > maxVisible && (
        <div className='w-9 h-9 flex justify-center items-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3'>
          +{safeAvatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
