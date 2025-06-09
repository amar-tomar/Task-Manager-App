import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../layout/Modal";
import AvatarGroup from "../layout/AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Fetch all users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get(apiPaths.users.getAllUsers);
        if (Array.isArray(data)) {
          setAllUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Sync tempSelectedUsers with selectedUsers when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers([...selectedUsers]);
    }
  }, [isModalOpen, selectedUsers]);

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers([...tempSelectedUsers]);
    setIsModalOpen(false);
  };

  const selectedAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  return (
    <div className="space-y-4 mt-2">
      {selectedAvatars.length === 0 ? (
        <button
          className="card-btn flex justify-center items-center gap-1.5 text-black"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <LuUsers className="text-sm" />
          Add Members
        </button>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          title="Edit Members"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === "Enter") setIsModalOpen(true); }}
        >
          <AvatarGroup avatars={selectedAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-min overflow-y-auto">
          {allUsers.length === 0 ? (
            <p className="text-gray-500">No users available</p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-2 border rounded-md"
              >
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{user.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toggleUserSelection(user._id)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    tempSelectedUsers.includes(user._id)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {tempSelectedUsers.includes(user._id) ? "Selected" : "Select"}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleAssign}
            disabled={tempSelectedUsers.length === 0}
          >
            Assign Users
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
