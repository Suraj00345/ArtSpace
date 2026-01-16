import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  User,
  Mail,
  ShieldCheck,
  Moon,
  Sun,
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  Loader2,
  Check,
  Clock,
} from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  // Username feature states
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [lastChanged, setLastChanged] = useState(null); // To track cooldown
  const [updateStatus, setUpdateStatus] = useState("idle");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    // Update React State (for the UI)
    setTheme(newTheme);
    // Update LocalStorage (for persistence)
    localStorage.setItem("theme", newTheme);
    // Update the HTML class (for Tailwind/CSS logic)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const API_URL = "http://localhost:3000";
  const authToken = localStorage.getItem("token");
  const COOLDOWN_DAYS = 14;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) return;
      try {
        const decoded = jwtDecode(authToken);
        const userId = decoded._id || decoded.userId;

        const res = await fetch(`${API_URL}/profile/${userId}`, {
          headers: { Authorization: authToken },
        });

        const data = await res.json();

        setOriginalUsername(data.user.username || "");
        setUsername(data.user.username);
        // Store the date from your backend

        setLastChanged(data.user.usernameChangedAt);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [authToken]);

  // Cooldown Calculation
  const getCooldownInfo = () => {
    if (!lastChanged) return { isUnderCooldown: false, daysLeft: 0 };

    const lastDate = new Date(lastChanged);
    const now = new Date();
    const diffInMs = now - lastDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < COOLDOWN_DAYS) {
      return {
        isUnderCooldown: true,
        daysLeft: Math.ceil(COOLDOWN_DAYS - diffInDays),
      };
    }
    return { isUnderCooldown: false, daysLeft: 0 };
  };

  const cooldown = getCooldownInfo();
  //handle username update
  const handleUpdateUsername = async () => {
    setUpdateStatus("loading");
    try {
      const response = await fetch(`${API_URL}/settings/username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ username: username }),
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalUsername(username);
        setLastChanged(new Date()); // Update local cooldown immediately
        setUpdateStatus("success");
        setTimeout(() => setUpdateStatus("idle"), 3000);
      } else {
        // You can use data.message from your controller here
        setUpdateStatus("error");
      }
    } catch (error) {
      setUpdateStatus("error");
    }
  };

  //handle loggedout function
  const handleLoggedOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("theme");
    //redirect it into login route
    navigate("/login", { replace: true });
  };

  const isUnchanged = username === originalUsername || username.trim() === "";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 md:p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div
          className={`rounded-2xl shadow-xl overflow-hidden border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="p-6 space-y-6">
            <h2 className="text-sm tracking-wider text-gray-500 font-bold uppercase">
              Account
            </h2>

            {/* Username Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} /> Username
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={cooldown.isUnderCooldown}
                  className={`flex-1 p-2.5 rounded-lg border outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  } ${
                    cooldown.isUnderCooldown
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                />
                <button
                  onClick={handleUpdateUsername}
                  disabled={
                    isUnchanged ||
                    updateStatus === "loading" ||
                    cooldown.isUnderCooldown
                  }
                  className={`min-w-[100px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    updateStatus === "success"
                      ? "bg-green-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  }`}
                >
                  {updateStatus === "loading" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : updateStatus === "success" ? (
                    <Check size={18} />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>

              {/* COOLDOWN TIMELINE BOX */}
              {cooldown.isUnderCooldown && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-amber-900/20 border-amber-800/50 text-amber-200"
                      : "bg-amber-50 border-amber-100 text-amber-700"
                  }`}
                >
                  <Clock size={16} className="shrink-0" />
                  <p className="text-xs font-medium">
                    You can change your username again after{" "}
                    <span className="font-bold underline">
                      {cooldown.daysLeft} days
                    </span>
                  </p>
                </div>
              )}

              {updateStatus === "error" && (
                <p className="text-xs text-red-500 font-medium">
                  Failed to update. Check cooldown or availability.
                </p>
              )}
            </div>

            {/* Rest of the component stays the same */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <div className="flex gap-2">
                <input
                  disabled={true}
                  type="email"
                  placeholder="john@example.com"
                  className={`flex-1 p-2.5 rounded-lg border opacity-60 cursor-not-allowed ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
                <button
                  disabled={true}
                  className="min-w-[100px] bg-indigo-600 opacity-50 cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Update
                </button>
              </div>
            </div>

            <button
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                theme === "dark"
                  ? "hover:bg-gray-700 border-gray-700"
                  : "hover:bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Lock size={18} />
                </div>
                <span className="font-medium">Change Password</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Preferences Section */}
          <div
            className={`p-6 space-y-6 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider">
              Preferences
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-yellow-900 text-yellow-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
                </div>
                <span className="font-medium">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  theme === "dark" ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className={`p-6 bg-opacity-50 ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <button
              onClick={handleLoggedOut}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold transition"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
