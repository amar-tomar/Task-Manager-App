import React, { useState } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className='space-y-3 mt-4'>
      {/* List of todos */}
      {todoList.map((item, index) => (
        <div
          key={index}
          className='flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm hover:shadow transition-shadow'
        >
          <p className='text-sm text-black flex-1'>
            <span className='text-gray-400 font-semibold mr-2'>
              {index < 9 ? `0${index + 1}` : index + 1}.
            </span>
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className='p-1 rounded hover:bg-red-100 transition-colors'
            title='Delete task'
          >
            <HiOutlineTrash className='text-red-500 text-lg' />
          </button>
        </div>
      ))}

      {/* Input for new todo */}
      <div className='flex items-center gap-2'>
        <input
          type='text'
          placeholder='Enter a new task'
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className='flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md outline-none '
        />
        <button
          onClick={handleAddOption}
          className=' flex justify-center items-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          title='Add task'
        >
          <HiOutlinePlus className='text-lg mr-1' />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
