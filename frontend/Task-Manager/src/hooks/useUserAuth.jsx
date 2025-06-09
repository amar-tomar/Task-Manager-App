import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (loading) return;

    if (!user && !token) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};

export default useUserAuth;
