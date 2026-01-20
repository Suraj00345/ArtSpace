import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState } from "react";
import "./App.css";

// Components
import Login from "./Pages/login";
import Signup from "./Pages/Signup";
import Explore from "./Pages/Explore/Explore";
import RefreshHandler from "./RefreshHandler";
import Dashboard from "./Pages/Dashboard";
import LeftNavbar from "./Pages/Navbar";
import Notification from "./Pages/Notification";
import Settings from "./Pages/Settings";
import Profile from "./Pages/UserProfile";
import Search from "./Pages/SearchPage";

//  The Layout Wrapper
//  This handles the repetitive UI (Navbar + Main container)

const AppLayout = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <LeftNavbar />
      <main className="ml-64 w-full">
        {/* Outlet renders the child routes defined in App() */}
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/*Protected Routes Group using the Layout */}
          <Route element={<AppLayout isAuthenticated={isAuthenticated} />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:artistId" element={<Profile />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
