import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiUserCheck,
  FiPhone,
  FiHome,
  FiEdit2,
} from "react-icons/fi";
import PropTypes from "prop-types";
import EditProfileForm from "../forms/EditProfileForm";
import { useProfile } from "../hooks/";

function PersonalInfo() {
  const [showModal, setShowModal] = useState(false);
  const { userData, role } = useProfile();

  if (!userData) {
    return <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 self-center ml-[40%]" />
  }

  return (
    <div className="bg-white bg-opacity-80 w-1/3 p-6 text-gray-800 flex flex-col rounded-xl shadow-xl">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">
            Welcome, {userData.first_name}!
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            title="Edit Profile"
          >
            <FiEdit2 /> <span>Edit Profile</span>
          </button>
        </div>

        <ul className="space-y-6 text-left">
          <li className="flex items-center p-4 bg-white rounded-lg shadow-md">
            <FiUser className="text-blue-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="ml-2 font-semibold">
              {userData.first_name} {userData.last_name}
            </span>
          </li>
          <li className="flex items-center p-4 bg-white rounded-lg shadow-md">
            <FiMail className="text-blue-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="ml-2 font-semibold">{userData.email}</span>
          </li>
          <li className="flex items-center p-4 bg-white rounded-lg shadow-md">
            <FiUserCheck className="text-blue-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-600">
              {role.charAt(0).toUpperCase() + role.slice(1)} ID:
            </span>
            <span className="ml-2 font-semibold">{userData.user_id}</span>
          </li>
          <li className="flex items-center p-4 bg-white rounded-lg shadow-md">
            <FiPhone className="text-blue-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-600">Phone Number:</span>
            <span className="ml-2 font-semibold">{userData.phone}</span>
          </li>
          <li className="flex flex-col items-start p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FiHome className="text-blue-600 text-2xl mr-4" />
              <span className="font-semibold text-gray-600">Address:</span>
            </div>
            <ul className="ml-10 text-gray-700 font-semibold">
              <li>
                {userData.address.street_number} {userData.address.street_name}
              </li>
              <li>
                {userData.address.city}, {userData.address.province}
              </li>
              <li>{userData.address.postal_code}</li>
            </ul>
          </li>
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-semibold">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <EditProfileForm setShowModal={setShowModal} />
          </div>
        </div>
      )}
    </div>
  );
}

PersonalInfo.propTypes = {
  userData: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    address: PropTypes.shape({
      street_number: PropTypes.string.isRequired,
      street_name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      province: PropTypes.string.isRequired,
      postal_code: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  setUserData: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

export default PersonalInfo;
