import React, { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePaperClip,
} from "react-icons/hi";

const AddAttachmentInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div className='space-y-3 mt-4'>
      {/* List of attachments */}
      {attachments.map((item, index) => (
        <div
          key={index}
          className='flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm hover:shadow transition-shadow'
        >
          <p className='text-sm text-black flex-1 flex items-center gap-2'>
            <HiOutlinePaperClip className='text-gray-400 text-base' />
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className='p-1 rounded hover:bg-red-100 transition-colors'
            title='Delete attachment'
          >
            <HiOutlineTrash className='text-red-500 text-lg' />
          </button>
        </div>
      ))}

      {/* Input for new attachment */}
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2 flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-200 transition'>
          <HiOutlinePaperClip className='text-gray-400 text-base' />
          <input
            type='text'
            placeholder='Enter a new attachment'
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className='flex-1 text-sm outline-none'
          />
        </div>
        <button
          onClick={handleAddOption}
          className='flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          title='Add attachment'
        >
          <HiOutlinePlus className='text-lg' />
          <span className='text-sm font-medium'>Add</span>
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentInput;
