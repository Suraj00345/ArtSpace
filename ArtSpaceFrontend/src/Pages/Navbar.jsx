import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-200"}`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm">
      {/* Logo */}
      <div className="p-9 text-3xl font-bold border-b">
        Art<span className="text-gray-500">Space</span>
      </div>

      {/* Nav Links */}
      <nav className="p-4 flex flex-col gap-2">
        <NavLink to="/explore" className={linkClass}>
          Explore
        </NavLink>

        <NavLink to="/notification" className={linkClass}>
          Notifications
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Navbar;
