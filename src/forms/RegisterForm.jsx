import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useApiHost } from "../hooks";
import { Eye, EyeOff } from "lucide-react";

function RegisterScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const { API_HOST } = useApiHost();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    program: "",
    phone: "",
    street_number: "",
    street_name: "",
    city: "",
    province: "",
    postal_code: "",
    password: "",
    retype_password: "",
  });

  const programOptions = [
    "Computer Science",
    "Engineering",
    "Business",
    "Arts",
    "Mathematics",
    "Biology",
    "Physics",
  ];

  const provinceOptions = [
    "Ontario",
    "Quebec",
    "British Columbia",
    "Alberta",
    "Manitoba",
    "Saskatchewan",
    "Nova Scotia",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Prince Edward Island",
  ];

  const inputStyles = "w-full border-2 border-gray-700 rounded-2xl py-4 px-2 h-14";
  const passwordContainerStyles = "relative w-full flex items-center";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.retype_password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_HOST}/auth/register`,
        {
          last_name: formData.last_name,
          first_name: formData.first_name,
          email: formData.email,
          password: formData.password,
          program: formData.program,
          phone: formData.phone,
          street_number: formData.street_number,
          street_name: formData.street_name,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
          role: "student",
        },
        { withCredentials: true }
      );

      console.log("Registration successful:", response.data);
      toast.success("Registration successful!");
      setShowPopup(true); // Show the popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 3 seconds
        navigate("/login"); // Redirect to login page
      }, 3000);
    } catch (error) {
      toast.error("Failed to register. Please try again.");
      console.error("Error during registration:", error);
    }
  };

  // Popup component
  const ThankYouPopup = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
          <p className="text-lg">Your account has been successfully created.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex w-full h-screen pt-12 overflow-hidden">
      {/* Low-opacity box */}
      <div className="absolute z-10 opacity-[60%] bg-[#1A1E36] w-[45%] h-full rounded-tl-[6rem] ml-auto right-12"></div>

      {/* White box container on top */}
      <div className="relative z-20 flex justify-center items-center bg-white w-[45%] h-full rounded-tl-[6rem] ml-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-4 p-16"
        >
          <h1 className="font-semibold text-2xl">Create an Account</h1>
                    {/* FIRST AND LAST */}
                    <div className="flex justify-between space-x-4">
            <div className="w-1/3">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
          </div>
          {/* PROGRAM AND PHONE */}
          <div className="flex justify-between space-x-4">
            <div className="w-1/2">
              <label htmlFor="program">Program</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className={inputStyles}
              >
                <option value="">Select Program</option>
                {programOptions.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
          </div>
          {/* STREET NUMBER AND STREET NAME */}
          <div className="flex justify-between space-x-4">
            <div className="w-1/2">
              <label htmlFor="street_number">Street Number</label>
              <input
                type="text"
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="street_name">Street Name</label>
              <input
                type="text"
                name="street_name"
                value={formData.street_name}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
          </div>
          {/* CITY, PROVINCE AND POSTAL CODE */}
          <div className="flex space-x-4">
            <div className="w-1/3">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="province">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className={inputStyles}
              >
                <option value="">Select Province</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="postal_code">Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
          </div>
          {/* PASSWORDS */}
          <div>
            <label htmlFor="password">Password</label>
            <div className={passwordContainerStyles}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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

          <div className="mt-4">
            <label htmlFor="retype_password">Re-type Password</label>
            <div className={passwordContainerStyles}>
              <input
                type={showRetypePassword ? "text" : "password"}
                name="retype_password"
                value={formData.retype_password}
                onChange={handleChange}
                required
                className={inputStyles}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
              >
                {showRetypePassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          {/* BUTTONS */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              type="submit"
              className="mt-4 text-white py-3 px-4 rounded-full w-[75%]"
              style={{
                backgroundColor: "#AB7EB9",
                border: "2px solid #1A1E36",
                fontSize: "20px",
              }}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="button-blue-link-small mt-4"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>

      {/* Render the popup if showPopup is true */}
      {showPopup && <ThankYouPopup />}
    </div>
  );
}

export default RegisterScreen;