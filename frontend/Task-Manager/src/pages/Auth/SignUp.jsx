import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();

  console.log("SignUp initiated");
  console.log("Full Name:", fullName);
  console.log("Email:", email);
  console.log("Admin Invite Token:", adminInviteToken);
  console.log("Profile Pic:", profilePic);

  if (!fullName) {
    setError("Please enter your full name.");
    console.log("Error: Full name missing");
    return;
  }
  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    console.log("Error: Invalid email");
    return;
  }
  if (!password) {
    setError("Please enter the password.");
    console.log("Error: Password missing");
    return;
  }

  setError("");

  try {
    // Prepare form data for sending with file upload
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("adminInviteToken", adminInviteToken);
    if (profilePic) {
      formData.append("profileImage", profilePic);
      console.log("Appending profile image to form data");
    }

    console.log("Sending signup request with form data...");
    const response = await axiosInstance.post(apiPaths.auth.register, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Signup response:", response.data);
    const { token, role } = response.data;
    updateUser(response.data);

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token saved. Navigating based on role:", role);
      if (role === "admin") {
        navigate("/admin/admin-dashboard");
      } else {
        navigate("/user/user-dashboard");
      }
    }
  } catch (error) {
    console.error("Signup error:", error);
    setError("Something went wrong. Please try again!");
  }
};

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome!</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label='Full Name'
              placeholder='Your Name Here...'
              type='text'
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='john@example.com'
              type='email'
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              placeholder='Your Password Here... Min 8 Characters'
              type='password'
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label='Admin Token'
              placeholder='Your Token Here...'
              type='text'
            />
          </div>

          {error && <p className='text-red-500 text-xs pt-2'>{error}</p>}

          <button type='submit' className='btn-primary mt-4 w-full'>
            Sign Up
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link
              className='font-medium text-blue-500 no-underline'
              to='/login'
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
