import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Palette, Mail, Lock, User } from "lucide-react"; 
import { handleError, handleSuccess } from "../utils";
import { API_URL } from "../utils";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("Input all Credentials!!");
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      
      {/* Background Artistic Element: Soft Purple Orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-50 rounded-full blur-[100px] opacity-70"></div>

      {/* Signup Card */}
      <div className="w-full max-w-lg bg-white shadow-[0_20px_60px_-15px_rgba(76,29,149,0.12)] rounded-3xl p-10 md:p-14 border border-gray-100 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center shadow-sm mb-5 group hover:border-purple-500 transition-all duration-300">
            <Palette className="w-8 h-8 text-purple-700" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Join the <span className="text-purple-700">Studio.</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Start your journey as an ArtSpace creator.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name Input */}
          <div className="relative group">
            <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all group-focus-within:text-purple-700">
              Artist Name
            </label>
            <div className="flex items-center">
              <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-600" />
              <input
                onChange={handleChange}
                type="text"
                name="name"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition duration-200"
                placeholder="What should we call you?"
                value={signupInfo.name}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all group-focus-within:text-purple-700">
              Email Address
            </label>
            <div className="flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-600" />
              <input
                onChange={handleChange}
                type="email"
                name="email"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition duration-200"
                placeholder="your@email.com"
                value={signupInfo.email}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative group">
            <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all group-focus-within:text-purple-700">
              Create Password
            </label>
            <div className="flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-600" />
              <input
                onChange={handleChange}
                type="password"
                name="password"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition duration-200"
                placeholder="••••••••"
                value={signupInfo.password}
              />
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-purple-100 transition-all duration-300 transform active:scale-[0.98] focus:ring-4 focus:ring-purple-200"
          >
            Create My Portfolio
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400 font-medium italic">or</span>
            </div>
          </div>

          {/* Login Redirect */}
          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already an Artery member? 
              <Link
                to="/login"
                className="text-purple-700 font-bold hover:underline ml-1.5"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>

        <ToastContainer position="bottom-center" autoClose={2500} />
      </div>

      {/* Artist Credit */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 z-10">
         <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">
           Est. 2026
         </p>
      </div>
    </div>
  );
};

export default Signup;