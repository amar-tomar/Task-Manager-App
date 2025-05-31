import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  // Find selected option label (or null)
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className='relative w-full'>
      {/* Dropdown button */}
      <button
        type='button'
        className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={`${!selectedOption ? "text-gray-400" : ""}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className='ml-2'>
          <BiChevronDown className={isOpen ? "rotate-180" : ""} />
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto'>
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                option.value === value ? "bg-gray-100 font-medium" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
