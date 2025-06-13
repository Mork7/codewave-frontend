import { useState } from "react";
import axios from "axios";
import { useApiHost } from "../hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { API_HOST } = useApiHost();
  const navigate = useNavigate();

  // Input styles
  const inputStyles =
    "p-4 border-2 border-gray-700 rounded-2xl w-full focus:bg-gray-100";

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_HOST}/auth/forgot_password`, {
        email,
        withCredentials: true,
      });
      toast.success(
        response.data.message ||
          "Password reset link sent! Please check your email."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div className="h-screen pt-12 bg-gray-300 w-[55rem] bg-opacity-65 rounded-tr-[10rem] flex justify-center items-center">
      {/* Background Image Container */}
      <form
        onSubmit={handleForgotPassword}
        className="bg-white rounded-tr-[10rem] w-[40rem] h-[50rem] rounded-xl shadow-2xl shadow-slate-700 flex flex-col items-center p-10 justify-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="./login-logo.png" alt="Logo" className="w-24" />
        </div>

        {/* Forgot Password Heading */}
        <div className="w-[26rem] flex flex-col space-y-2 text-center">
          <h1 className="mt-5 font-semibold text-3xl">Forgot Password</h1>
          <p className="text-xl text-gray-500">Please enter your email</p>
        </div>

        {/* Email Input */}
        <div className="mt-6 w-[30rem] justify-center space-y-4">
          <label htmlFor="email" className="font-semibold text-xl mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputStyles} h-[5rem]`} // Adjust height here
          />
        </div>

        {/* Send Request Button */}
        <button
          type="submit"
          className="mt-8 mb-8 button-base bg-pink-500 text-white text-xl rounded-full w-[30rem] py-4 hover:bg-blue-700"
        >
          Send Reset Link
        </button>

        {/* Go Back to Login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="button-blue-link -mt-4"
        >
          Go Back to Login
        </button>
      </form>
    </div>
  );
}
