import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile, useApiHost } from "../hooks/";
import { Eye, EyeOff } from "lucide-react";

function EditProfileForm({ setShowModal }) {
  const { userData, setUserData } = useProfile();
  const [editedUserData, setEditedUserData] = useState(userData);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { API_HOST } = useApiHost();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  useEffect(() => {
    setEditedUserData(userData);
  }, [userData]);

  const handleInputChange = (field, value) => {
    setEditedUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setEditedUserData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes to the user profile
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate phone number format
    if (
      editedUserData.phone &&
      !/^\d{3}-\d{3}-\d{4}$/.test(editedUserData.phone)
    ) {
      toast.error("Invalid phone number format. Use XXX-XXX-XXXX.");
      return;
    }

    // Validate postal code format
    if (
      editedUserData.address.postal_code &&
      !/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(
        editedUserData.address.postal_code.toUpperCase()
      )
    ) {
      toast.error("Invalid postal code format. Use A1A 1A1.");
      return;
    }

    if (
      passwords.newPassword &&
      passwords.newPassword !== passwords.confirmPassword
    ) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.put(`${API_HOST}/admin/profile`, editedUserData, {
        withCredentials: true,
      });

      if (passwords.newPassword) {
        await axios.put(
          `${API_HOST}/auth/change_password`,
          { password: passwords.newPassword },
          { withCredentials: true }
        );
      }

      toast.success("Profile updated successfully!");
      setUserData(editedUserData);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <section className="flex justify-evenly space-x-4">
        <div className="w-1/2">
          <label>First Name</label>
          <input
            type="text"
            value={editedUserData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="John"
          />
        </div>
        <div className="w-1/2">
          <label>Last Name</label>
          <input
            type="text"
            value={editedUserData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Doe"
          />
        </div>
      </section>

      <div>
        <label>Phone</label>
        <input
          type="text"
          value={editedUserData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="519-913-9992"
        />
      </div>

      <h3 className="text-xl font-semibold mt-6">Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Street Number</label>
          <input
            type="text"
            value={editedUserData.address.street_number}
            onChange={(e) =>
              handleAddressChange("street_number", e.target.value)
            }
            className="w-full p-2 border rounded"
            placeholder="1234"
          />
        </div>
        <div>
          <label>Street Name</label>
          <input
            type="text"
            value={editedUserData.address.street_name}
            onChange={(e) => handleAddressChange("street_name", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Sunset Ave"
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            value={editedUserData.address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Windsor"
          />
        </div>
        <div>
          <label>Province</label>
          <input
            type="text"
            value={editedUserData.address.province}
            onChange={(e) => handleAddressChange("province", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ontario"
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            type="text"
            value={editedUserData.address.postal_code}
            onChange={(e) => handleAddressChange("postal_code", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="A1A 1A1"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6">Change Password</h3>
      <div>
        <label>New Password</label>
        <div className="relative w-full">
          <input
            type={!showPassword ? "password" : "text"}
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              handlePasswordChange("newPassword", e.target.value)
            }
            className="w-full p-2 border rounded"
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
        <label>Confirm Password</label>
        <div className="relative w-full">
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              handlePasswordChange("confirmPassword", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowRetypePassword(!showRetypePassword)}
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="button red-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSave}
          className="button blue-button"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;

EditProfileForm.propTypes = {
  setShowModal: PropTypes.func.isRequired,
};
