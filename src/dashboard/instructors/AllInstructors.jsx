// ManageInstructorsView.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useApiHost } from "../../hooks";
import EditInstructorModal from "./EditInstructorModal"; // Adjust the path as necessary
import { toast } from "react-toastify";
import Swal from "sweetalert2";
/**
 * Convert an instructor object to a single lowercase string for searching
 * @param {Object} instructor - The instructor object
 * @returns {string} - The flattened string
 */
function flattenInstructorData(instructor) {
  const parts = [
    instructor.user_id?.toString(),
    instructor.first_name,
    instructor.last_name,
    instructor.email,
    instructor.program,
    instructor.role,
  ];
  return parts
    .filter(Boolean)
    .map((p) => p.toLowerCase())
    .join(" ");
}

function AllInstructors({ filterText }) {
  const { API_HOST } = useApiHost();
  const [instructors, setInstructors] = useState(() => {
    const storedInstructors = sessionStorage.getItem("instructors");
    return storedInstructors ? JSON.parse(storedInstructors) : [];
  });
  const [editingInstructor, setEditingInstructor] = useState(null);

  useEffect(() => {
    if (instructors.length === 0) {
      const fetchInstructors = async () => {
        try {
          const response = await axios.get(`${API_HOST}/admin/instructors`, {
            withCredentials: true,
          });
          console.log(response.data);
          setInstructors(response.data);
          sessionStorage.setItem("instructors", JSON.stringify(response.data));
        } catch (error) {
          console.error(
            "Error fetching instructors:",
            error.response?.data || error.message
          );
        }
      };
      fetchInstructors();
    }
  }, [API_HOST, instructors]);

  // Filter the instructors based on filterText
  const filteredInstructors = instructors.filter((instructor) =>
    flattenInstructorData(instructor).includes(filterText.toLowerCase())
  );

  /**
   * Handle the update action for an instructor
   * @param {Object} updatedInstructor - The updated instructor object
   * @returns {Promise<void>}
   * @async
  */
  const handleUpdateInstructor = async (updatedInstructor) => {
    try {
      const response = await axios.put(
        `${API_HOST}/admin/instructors/${updatedInstructor.user_id}`,
        updatedInstructor,
        {
          withCredentials: true,
        }
      );
      console.log("Updated instructor:", response.data);

      const updatedInstructors = instructors.map((inst) =>
        inst.user_id === updatedInstructor.user_id ? updatedInstructor : inst
      );
      setInstructors(updatedInstructors);
      sessionStorage.setItem("instructors", JSON.stringify(updatedInstructors));
      setEditingInstructor(null);
      toast.success("Instructor updated successfully");
    } catch (error) {
      console.error(
        "Error updating instructor:",
        error.response?.data || error.message
      );
    }
  };

  /**
   * Handle the delete action for an instructor
   * @param {number} userId - The ID of the instructor to delete
   * @returns {Promise<void>}
   * @async
   */
  const handleDeleteInstructor = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this instructor!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete instructor!",
    });

    // Only proceed if the user confirms
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_HOST}/admin/instructors/${userId}`, {
          withCredentials: true,
        });

        // Update the UI after deletion
        const updatedInstructors = instructors.filter(
          (inst) => inst.user_id !== userId
        );
        setInstructors(updatedInstructors);
        sessionStorage.setItem(
          "instructors",
          JSON.stringify(updatedInstructors)
        );

        Swal.fire("Deleted!", "The instructor has been deleted.", "success");
      } catch (error) {
        console.error(
          "Error deleting instructor:",
          error.response?.data || error.message
        );
        toast.error("Failed to delete instructor");
      }
    } else {
      toast.info("Deletion canceled");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <ul className="space-y-4">
        {filteredInstructors.map((instructor) => (
          <li
            key={instructor.user_id}
            className="bg-gray-100 p-4 rounded-md shadow-sm justify-between flex items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {instructor.first_name} {instructor.last_name}
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">ID:</span> {instructor.user_id}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
                {instructor.email || "Not available"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Program:</span>{" "}
                {instructor.program || "N/A"}
              </p>
              {/* Render the instructor's courses (if any) */}
              {instructor.courses && instructor.courses.length > 0 ? (
                <p className="text-gray-600">
                  <span className="font-semibold">Courses:</span>{" "}
                  {instructor.courses
                    .map((course) => course.course_code)
                    .join(", ")}
                </p>
              ) : (
                <p className="text-gray-600">Courses: NA</p>
              )}
            </div>
            <div className="flex space-x-2 h-12">
              <button
                className="button blue-button"
                onClick={() => setEditingInstructor(instructor)}
              >
                Edit
              </button>
              <button
                className="button red-button"
                onClick={() => handleDeleteInstructor(instructor.user_id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingInstructor && (
        <EditInstructorModal
          instructor={editingInstructor}
          onClose={() => setEditingInstructor(null)}
          onSave={handleUpdateInstructor}
        />
      )}
    </div>
  );
}

AllInstructors.propTypes = {
  filterText: PropTypes.string.isRequired,
};

export default AllInstructors;
