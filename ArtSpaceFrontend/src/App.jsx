import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./Pages/login";
import Signup from "./Pages/Signup";
import Explore from "./Pages/Explore";
import RefreshHandler from "./RefreshHandler";
import Dashboard from "./Pages/Dashboard";
import LeftNavbar from "./Pages/Navbar";
import Notification from "./Pages/notification";
import Settings from "./Pages/settings";
import Profile from "./Pages/UserProfile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* EXPLORE */}
          <Route
            path="/explore"
            element={
              <PrivateRoute
                element={
                  <div className="flex">
                    <LeftNavbar />
                    <main className="ml-64 w-full">
                      <Explore />
                    </main>
                  </div>
                }
              />
            }
          />

          {/* DYNAMIC PROFILE PAGE (PROTECTED) */}
          <Route
            path="/profile/:artistId"
            element={
              <PrivateRoute
                element={
                  <div className="flex">
                    <LeftNavbar />
                    <main className="ml-64 w-full">
                      <Profile />
                    </main>
                  </div>
                }
              />
            }
          />

          {/* NOTIFICATION */}
          <Route
            path="/notification"
            element={
              <PrivateRoute
                element={
                  <div className="flex">
                    <LeftNavbar />
                    <main className="ml-64 w-full">
                      <Notification />
                    </main>
                  </div>
                }
              />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={
                  <div className="flex">
                    <LeftNavbar />
                    <main className="ml-64 w-full">
                      <Dashboard />
                    </main>
                  </div>
                }
              />
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <PrivateRoute
                element={
                  <div className="flex">
                    <LeftNavbar />
                    <main className="ml-64 w-full">
                      <Settings />
                    </main>
                  </div>
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
