import { FiUsers, FiBookOpen, FiSettings, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AdminActionsManager() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 bg-white min-h-screen bg-opacity-65 rounded-tr-[10rem] w-[50rem] shadow-2xl shadow-slate-700 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-2xl">
        <h1 className="text-3xl text-blue-800 font-bold mb-4 text-center">
          Admin Quick Actions
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Manage Users */}
          <button
            className="flex items-center bg-blue-100 p-4 rounded-lg shadow-md hover:bg-blue-200 transition"
            onClick={() => navigate("/dashboard")}
          >
            <FiUsers className="text-blue-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-800">Manage Users</span>
          </button>

          {/* Manage Courses */}
          <button
            className="flex items-center bg-green-100 p-4 rounded-lg shadow-md hover:bg-green-200 transition"
            onClick={() => navigate("/dashboard")}
          >
            <FiBookOpen className="text-green-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-800">Manage Courses</span>
          </button>

          {/* Add News (Only for Admins) */}
          <button
            className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md hover:bg-yellow-200 transition"
            onClick={() => navigate("/news")}
          >
            <FiEdit className="text-yellow-600 text-2xl mr-4" />
            <span className="font-semibold text-gray-800">Add News</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminActionsManager;
