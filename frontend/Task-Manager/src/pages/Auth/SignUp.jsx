import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null); // better to be null
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    let profileImageUrl = "";

    e.preventDefault();
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");
    // SignUP API Logic goes here
    try {
      // Upload Image if Present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(apiPaths.auth.register, {
        name: fullName,
        email,
        password,
        adminInviteToken,
        profileImageUrl,
      });
      const { token, role } = response.data;
      updateUser(response.data);
      console.log(response.data);
      if (token) {
        localStorage.setItem("token", token);
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/user-dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.message) {
        setError("Something is wrong. Please try again !");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome!</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp} className=''>
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
