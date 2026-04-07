import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Palette, Mail, Lock } from "lucide-react";
import { handleError, handleSuccess } from "../utils";
import { API_URL } from "../utils";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // ✅ added
  const navigate = useNavigate();
  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Input all Credentials!!");
    }
    setLoading(true); // ✅
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // In Fetch API, it is 'credentials', not 'withCredentials' (that's for Axios)
        credentials: "include",
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, error, jwtToken, name } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => navigate("/explore"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Login failed");
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-100 rounded-full blur-[100px] opacity-70"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-50 rounded-full blur-[100px] opacity-70"></div>

      <div className="w-full max-w-lg bg-white shadow-[0_20px_60px_-15px_rgba(76,29,149,0.15)] rounded-3xl p-10 md:p-14 border border-gray-100 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center shadow-lg shadow-purple-200 mb-5">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-950">
            Art
            <span className="text-gray-500">Space</span>
            <span className="text-purple-700">.</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Where creativity connects.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="relative group">
            <label
              className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-purple-700"
              htmlFor="email"
            >
              Email Address
            </label>

            <div className="flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                placeholder="you@artspace.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative group">
            <label
              className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500"
              htmlFor="password"
            >
              Password
            </label>

            <div className="flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={loginInfo.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-xs text-purple-600">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Your Gallery"}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              {" "}
              {/* ✅ fixed */}
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400">New Artist?</span>
            </div>
          </div>

          {/* Signup */}
          <Link
            to="/signup"
            className="block w-full text-center border-2 border-purple-100 text-purple-800 py-3.5 rounded-xl bg-purple-50"
          >
            Create Your Account →
          </Link>
        </form>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      <p className="absolute bottom-6 text-xs text-gray-400">
        "Every artist was first an amateur."
      </p>
    </div>
  );
};

export default Login;
