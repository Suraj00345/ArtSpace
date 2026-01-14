import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);

      // Redirect ONLY if user is on auth pages
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"
      ) {
        navigate("/explore", { replace: true });
      }
    }
  }, [location.pathname, navigate, setIsAuthenticated]);

  return null;
};

export default RefreshHandler;
