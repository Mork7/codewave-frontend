import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const inputStyles =
    "p-5 border-2 border-gray-700 rounded-2xl w-full focus:bg-gray-100 text-xl";
  const labelStyles = "font-semibold text-xl";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(
        e.target.email.value,
        e.target.password.value
      );

      if (response?.data?.error) {
        if (response.data.error === "Email not verified") {
          toast.error("Your email is not verified. Please check your inbox.");
          return;
        }

        toast.error(response.data.error);
        return;
      }
      navigate("/profile");
   
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(error.response.data.error || "Login failed.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-300 w-[55rem] bg-opacity-65 rounded-tr-[10rem] flex justify-center items-center pt-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-tr-[10rem] w-[40rem] h-[50rem] rounded-xl shadow-2xl shadow-slate-700 flex flex-col items-center p-10 justify-center"
      >
        <div className="w-[30rem] space-y-8 flex flex-col justify-center items-center">
          <img src="./login-logo.png" alt="Login Logo" className="w-24" />
          <div className="flex flex-col space-y-4 w-full">
            <label htmlFor="email" className={labelStyles}>
              Email
            </label>
            <input name="email" type="text" className={inputStyles} />
          </div>
          <div className="flex flex-col space-y-4 w-full relative">
            <label htmlFor="password" className={labelStyles}>
              Password
            </label>
            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={inputStyles}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <button
              type="button"
              className="button-blue-link -mt-4"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="button-blue-link -mt-4"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
          <button
            type="submit"
            className="border-2 border-gray-600 hover:bg-[#DC9DE5] p-4 w-60 rounded-full text-3xl bg-gray-100 font-sem"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
