import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
              focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
              value={signupInfo.name}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={signupInfo.email}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              value={signupInfo.password}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
            font-semibold transition-all duration-200"
          >
            Sign Up
          </button>

          {/* Link */}
          <p className="text-center text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
