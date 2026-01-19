import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  User,
  Mail,
  Moon,
  Sun,
  Lock,
  LogOut,
  ChevronRight,
  Loader2,
  Check,
  Clock,
  Trash2,
} from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  // Existing Username feature states
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [lastChanged, setLastChanged] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("idle");

  // New Delete Account states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
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
        setLastChanged(data.user.usernameChangedAt);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [authToken]);

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

      if (response.ok) {
        setOriginalUsername(username);
        setLastChanged(new Date());
        setUpdateStatus("success");
        setTimeout(() => setUpdateStatus("idle"), 3000);
      } else {
        setUpdateStatus("error");
      }
    } catch (error) {
      setUpdateStatus("error");
    }
  };

  const handleLoggedOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("theme");
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async () => {
    setUpdateStatus("loading");
    setDeleteError("");
    try {
      const response = await fetch(`${API_URL}/settings/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ password: confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        navigate("/signup", { replace: true });
      } else {
        setDeleteError(data.message || "Incorrect password. Please try again.");
        setUpdateStatus("idle");
      }
    } catch (error) {
      setDeleteError("Something went wrong. Please try again.");
      setUpdateStatus("idle");
    }
  };

  const isUnchanged = username === originalUsername || username.trim() === "";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 md:p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={` top-0  mb-6 transition-colors ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <h2 className="text-3xl font-bold">Settings⚙️</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences and security.🏠
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
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
                  className={`min-w-25 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
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
                  className="min-w-25 bg-indigo-600 opacity-50 cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Existing Change Password Button */}
            <div
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
                <button
                  className="font-medium opacity-50 cursor-not-allowed"
                  disabled={true}
                >
                  Change Password
                </button>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>

            {/* NEW Delete Account Button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                theme === "dark"
                  ? "hover:bg-red-900/20 border-gray-700"
                  : "hover:bg-red-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Trash2 size={18} />
                </div>
                <span className="font-medium text-red-500">Delete Account</span>
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

      {/* DELETE ACCOUNT MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-70 p-4">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all scale-100 ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action is permanent and cannot be undone. Please enter your
              password to confirm.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-red-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              {deleteError && (
                <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setConfirmPassword("");
                    setDeleteError("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={!confirmPassword || updateStatus === "loading"}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {updateStatus === "loading" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Delete Forever"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
