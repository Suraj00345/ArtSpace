import { Palette } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-violet-700 text-white" : "text-gray-600 hover:bg-gray-200"}`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white  shadow-sm">
      {/* Logo */}
      <div className="p-9 text-3xl font-bold bg-purple-100 shadow-sm  text-gray-600 flex items-center gap-2">
        <Palette className="w-8 h-8 text-purple-600" />
        <div>
          Art<span className="text-violet-700">Space</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-4 flex flex-col gap-2">
        <NavLink to="/explore" className={linkClass}>
          Explore 💥
        </NavLink>

        <NavLink to="/search" className={linkClass}>
          Search 🔍
        </NavLink>

        <NavLink to="/notification" className={linkClass}>
          Notifications 🔔
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard 🪪
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings ⚙️
        </NavLink>
      </nav>
    </aside>
  );
};

export default Navbar;
