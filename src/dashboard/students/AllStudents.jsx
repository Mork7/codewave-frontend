// students/AllStudents.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useApiHost } from "../../hooks";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import EditStudentModal from "./EditStudentModal";
import StudentCoursesModal from "./StudentCoursesModal";

/**
 * Flatten student data into a single string for search
 * @param {object} student 
 * @returns {string} Flattened student data 
 */
function flattenStudentData(student) {
  const parts = [
    student.first_name,
    student.last_name,
    student.email,
    student.phone,
    student.program,
    student.role,
    student.user_id?.toString(),
  ];
  if (student.address) {
    parts.push(
      student.address.street_number,
      student.address.street_name,
      student.address.city,
      student.address.province,
      student.address.postal_code
    );
  }
  return parts
    .filter(Boolean)
    .map((p) => p.toLowerCase())
    .join(" ");
}

export function AllStudents({ students: initialData, filterText }) {
  const { API_HOST } = useApiHost();
  const [students, setStudents] = useState(() => {
    const stored = sessionStorage.getItem("students");
    return stored ? JSON.parse(stored) : initialData || [];
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalStudent, setModalStudent] = useState(null);
  const [modalCourses, setModalCourses] = useState([]);

  // Fetch students if not already stored
  useEffect(() => {
    if (!students || students.length === 0) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(`${API_HOST}/admin/students`, {
            withCredentials: true,
          });
          setStudents(response.data);
          sessionStorage.setItem("students", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
      fetchStudents();
    }
  }, [API_HOST, students]);

  // Filter students based on Dashboard's filterText
  const filteredStudents = students.filter((s) =>
    flattenStudentData(s).includes(filterText.toLowerCase())
  );

  /**
   * Delete student by user_id
   * @param {string} user_id 
   * @returns {void}
   * @async
   */
  const handleDelete = async (user_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the student and all their enrollments!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${API_HOST}/admin/students/${user_id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedStudents = students.filter((s) => s.user_id !== user_id);
        setStudents(updatedStudents);
        sessionStorage.setItem("students", JSON.stringify(updatedStudents));
        Swal.fire("Deleted!", "The student has been deleted.", "success");
      }
    } catch (error) {
      toast.error("Failed to delete student.");
      console.error("Error deleting student:", error);
    }
  };

  // Open Edit Modal
  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  /**
   * Update student data
   * @param {object} updatedStudent 
   * @returns {void}
   * @async
   */
  const handleUpdateStudent = async (updatedStudent) => {
    try {
      const response = await axios.put(
        `${API_HOST}/admin/students/${updatedStudent.user_id}`,
        updatedStudent,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedStudents = students.map((s) =>
          s.user_id === updatedStudent.user_id ? updatedStudent : s
        );
        setStudents(updatedStudents);
        sessionStorage.setItem("students", JSON.stringify(updatedStudents));
        toast.success("Student updated successfully!");
        setSelectedStudent(null);
      }
    } catch (error) {
      toast.error("Error updating student.");
      console.error("Error updating student:", error);
    }
  };

  /**
   * Fetch courses for a student
   * @param {object} student
   * @returns {void}
   * @async
  */
  const handleToggleCourses = async (student) => {
    if (modalStudent?.user_id === student.user_id) {
      setModalStudent(null);
      setModalCourses([]);
    } else {
      try {
        const response = await axios.get(
          `${API_HOST}/admin/students/${student.user_id}/courses`,
          { withCredentials: true }
        );
        setModalCourses(response.data);
        setModalStudent(student);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to fetch enrolled courses.");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <ul className="space-y-4">
        {filteredStudents.map((student) => (
          <li
            key={student.user_id}
            className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">ID:</span> {student.user_id}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
                {student.email || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Program:</span>{" "}
                {student.program || "N/A"}
              </p>
            </div>
            <div className="flex space-x-2 h-12">
              <button
                className="button green-button"
                onClick={() => handleToggleCourses(student)}
              >
                View Courses
              </button>
              <button
                className="button blue-button"
                onClick={() => handleEdit(student)}
              >
                Edit
              </button>
              <button
                className="button red-button"
                onClick={() => handleDelete(student.user_id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={handleUpdateStudent}
        />
      )}

      {/* View Courses Modal */}
      {modalStudent && (
        <StudentCoursesModal
          student={modalStudent}
          courses={modalCourses}
          onClose={() => setModalStudent(null)}
        />
      )}
    </div>
  );
}

AllStudents.propTypes = {
  students: PropTypes.array,
  filterText: PropTypes.string.isRequired,
};

export default AllStudents;
