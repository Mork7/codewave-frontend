import { useEffect, useState } from "react";
import { FiBookOpen, FiUsers, FiClock } from "react-icons/fi";
import PropTypes from "prop-types";
import axios from "axios";
import { useApiHost } from "../hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function InstructorCourseManager({ courseData }) {
  const [sortedCourses, setSortedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [editedGrades, setEditedGrades] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    if (courseData) {
      setSortedCourses(
        [...courseData].sort((a, b) => a.term.localeCompare(b.term))
      );
    }
  }, [courseData]);

  /**
   * Fetch students enrolled in a course
   * @param {object} course
   */
  const fetchStudents = async (course) => {
    try {
      const response = await axios.get(
        `${API_HOST}/admin/courses/${course.course_code}/students`
      );
      console.log("Fetched students:", response.data);

      if (Array.isArray(response.data.students)) {
        setStudents(response.data.students);
        setEditedGrades({}); // Reset edited grades when a new course is opened
      } else {
        console.error("Unexpected response format:", response.data);
        setStudents([]);
      }

      setSelectedCourse(course);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  /**
   * Update the grade for a student
   * @param {string} userId
   * @param {number} grade
   * @returns void
   */
  const handleGradeChange = (userId, grade) => {
    setEditedGrades((prevGrades) => ({
      ...prevGrades,
      [userId]: grade,
    }));
  };

  /**
   * Submit the updated grades to the server, can submit multiple grades at once
   * @returns {Promise<void>}
   * @throws {Error} if the grade update fails
   * @async
   */
  const handleSubmit = async () => {
    const updates = Object.entries(editedGrades).map(([userId, grade]) => ({
      user_id: parseInt(userId),
      course_code: selectedCourse.course_code,
      grade: Number(grade),
    }));

    if (updates.length === 0) {
      toast.warn("No grade changes to submit.");
      return;
    }

    // Confirm with Swal before submitting
    Swal.fire({
      title: "Confirm Grade Update",
      text: "Are you sure you want to update these grades? This action cannot be undone and only an admin can revert it.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Grades",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            updates.map((update) =>
              axios.put(
                `${API_HOST}/admin/students/${update.user_id}/update-grade`,
                {
                  course_code: update.course_code,
                  grade: update.grade,
                }
              )
            )
          );

          // Update the UI after a successful update
          setStudents((prevStudents) =>
            prevStudents.map((student) => ({
              ...student,
              grade: editedGrades[student.user_id] ?? student.grade,
            }))
          );

          setEditedGrades({});
          Swal.fire("Success!", "Grades updated successfully.", "success");
          setShowModal(false);
        } catch (error) {
          console.error("Error submitting grades:", error);
          toast.error("Failed to update grades. Please try again.");
        }
      }
    });
  };

  return (
    <div className="pt-24 bg-white min-h-screen bg-opacity-65 rounded-tr-[10rem] w-[60rem] shadow-2xl shadow-slate-700 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-2xl">
        <h1 className="text-3xl text-blue-800 font-bold mb-4 text-center">
          Courses You Teach
        </h1>

        {sortedCourses.length === 0 ? (
          <p className="text-gray-500 text-center">No courses assigned.</p>
        ) : (
          <div className="mt-6 flex flex-col overflow-y-scroll h-[70vh]">
            {sortedCourses.map((course) => (
              <div
                key={course.course_code}
                className="border rounded p-3 mb-4 shadow-md flex justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold flex items-center">
                    <FiBookOpen className="text-blue-600 mr-2" />
                    {course.course_code} - {course.course_name}
                  </h3>
                  <p className="text-gray-700 flex items-center">
                    <FiClock className="text-blue-600 mr-2" />
                    <span className="font-bold">Term:&nbsp;</span> {course.term}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FiUsers className="text-blue-600 mr-2" />
                    <span className="font-bold">Enrolled Students:&nbsp;</span>
                    {course.enrollments?.length || "0"}
                  </p>
                </div>

                <button
                onClick={() => fetchStudents(course)}
                className="button green-button h-auto"
              >
                View Students
              </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Grade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="big-popup-box">
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedCourse.course_code} - {selectedCourse.course_name}
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Current Grade</th>
                  <th className="p-2 border">Update Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.user_id} className="border">
                      <td className="p-2 border">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="p-2 border">{student.grade ?? "N/A"}</td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          className="border p-1 w-20 text-center"
                          value={
                            editedGrades[student.user_id] ?? student.grade ?? ""
                          }
                          onChange={(e) =>
                            handleGradeChange(student.user_id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      No students enrolled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="button red-button"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="button blue-button"
              >
                Submit Grades
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

InstructorCourseManager.propTypes = {
  courseData: PropTypes.array.isRequired,
};

export default InstructorCourseManager;
