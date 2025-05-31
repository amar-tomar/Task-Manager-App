import apiPaths from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Append image file to form data
  formData.append("image", imageFile);
  try {
    const response = await axiosInstance.post(
      apiPaths.auth.uploadImage,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Uploading the image:", error);
    throw error;
  }
};
export default uploadImage
