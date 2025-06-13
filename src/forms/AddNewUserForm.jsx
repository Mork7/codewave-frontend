import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useApiHost } from "../hooks";
import { Eye, EyeOff } from "lucide-react";

const initialFormData = {
  first_name: "",
  last_name: "",
  email: "",
  program: "",
  phone: "",
  street_number: "",
  street_name: "",
  city: "",
  province: "",
  postal_code: "",
  password: "",
  retype_password: "",
};

function AddNewUser({ role }) {
  const { API_HOST } = useApiHost();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  // Form data state
  const [formData, setFormData] = useState({initialFormData});

  // Available options for dropdowns
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

  // Tailwind utility class for form inputs
  const inputStyles =
    "w-full border-2 border-gray-700 rounded-2xl py-2 px-2 h-12 text-gray-800";
  const passwordContainerStyles = "relative w-full flex items-center";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the form data state by spreading the existing data and updating the new value
    setFormData({ ...formData, [name]: value });
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({initialFormData});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple password match check
    if (formData.password !== formData.retype_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Make POST request to your admin route for creating users
      const response = await axios.post(
        `${API_HOST}/auth/register`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          program: formData.program,
          phone: formData.phone,
          street_number: formData.street_number,
          street_name: formData.street_name,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
          role: role,
        },
        { withCredentials: true }
      );

      console.log("User added successfully:", response.data);
      toast.success("User added successfully!");
      // Reset the form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
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
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md text-gray-800 h-full">
      <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-4">
        {/* FIRST LAST AND EMAIL */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="first_name" className="block mb-1 font-semibold">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-1 font-semibold">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jonh.doe@example.ca"
              required
              className={inputStyles}
            />
          </div>
        </div>

        {/* PROGRAM AND PHONE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="program" className="block mb-1 font-semibold">
              Program
            </label>
            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              className={inputStyles}
            >
              <option value="">Select Program</option>
              {programOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-semibold">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="123-456-7890"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputStyles}
            />
          </div>
        </div>

        {/* STREET NAME AND ADDRESS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="street_number" className="block mb-1 font-semibold">
              Street Number
            </label>
            <input
              type="text"
              name="street_number"
              value={formData.street_number}
              onChange={handleChange}
              placeholder="123"
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="street_name" className="block mb-1 font-semibold">
              Street Name
            </label>
            <input
              type="text"
              name="street_name"
              value={formData.street_name}
              onChange={handleChange}
              placeholder="Main St."
              required
              className={inputStyles}
            />
          </div>
        </div>

        {/* CITY PROVINCE AND POSTAL CODE*/}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block mb-1 font-semibold">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Toronto"
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="province" className="block mb-1 font-semibold">
              Province
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className={inputStyles}
            >
              <option value="">Select Province</option>
              {provinceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="postal_code" className="block mb-1 font-semibold">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              placeholder="A1A1A1"
              value={formData.postal_code}
              onChange={handleChange}
              required
              className={inputStyles}
            />
          </div>
        </div>

        {/* PASSWORD AND RE-TYPE PASSWORD */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <div className={passwordContainerStyles}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
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
          <div>
            <label htmlFor="retype_password" className="block mb-1 font-semibold">
              Retype Password
            </label>
            <div className={passwordContainerStyles}>
              <input
                type={showRetypePassword ? "text" : "password"}
                name="retype_password"
                value={formData.retype_password}
                onChange={handleChange}
                placeholder="Retype your password"
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
        </div>

        {/* FORM CONTROL BUTTONS */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            type="reset"
            className="button red-button"
          >
            Reset
          </button>
          <button
            type="submit"
            className="button blue-button"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
}
AddNewUser.propTypes = {
  role: PropTypes.string.isRequired,
};

export default AddNewUser;
