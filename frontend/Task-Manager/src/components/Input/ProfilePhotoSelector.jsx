import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center items-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => {
          handleImageChange(e);
          e.target.value = null; // allow re-uploading the same file
        }}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-blue-500" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
            title="Upload"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative w-20 h-20">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-full h-full rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
            title="Change Image"
          >
            <LuUpload />
          </button>
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full absolute -top-1 -right-1"
            onClick={handleRemoveImage}
            title="Remove Image"
          >
            <LuTrash className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
