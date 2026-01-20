import { Navigate, Outlet } from "react-router-dom";
import LeftNavbar from "./Pages/Navbar";

const ProtectedLayout = ({ isAuthenticated }) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the Sidebar and the specific page (Outlet)
  return (
    <div className="flex">
      <LeftNavbar />
      <main className="ml-64 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
