import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const useUserAuth = () => {
  const { User, Loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (Loading) return;

    if (!User && !token) {
      clearUser();
      navigate("/login");
    }
  }, [User, Loading, clearUser, navigate]);
};

export default useUserAuth;
