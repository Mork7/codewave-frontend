import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useApiHost } from "../hooks";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  // Token comes from the email link
  const token = searchParams.get("token");
  const { API_HOST } = useApiHost();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${API_HOST}/auth/reset_password/${token}`, {
        password,
        withCredentials: true,
      });
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Reset Your Password</h1>

      {/* Password Input with Toggle */}
      <div className="relative w-80">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-5"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>
      </div>

      {/* Confirm Password Input with Toggle */}
      <div className="relative w-80">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-5"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>
      </div>

      <button
        onClick={handleReset}
        className="button blue-button"
      >
        Reset Password
      </button>
    </div>
  );
}
