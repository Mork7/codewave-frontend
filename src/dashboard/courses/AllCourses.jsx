// ManageCoursesView.jsx
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useApiHost } from "../../hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import EditCourseModal from "./EditCourseModal";
import CourseStudentsModal from "./CourseStudentsModal";

/**
 * Flatten course data into a single string for easier filtering
 * @param {Object} course 
 * @returns 
 */
function flattenCourseData(course) {
  const parts = [
    course.course_code,
    course.course_name,
    course.description,
    course.instructor,
    course.term,
    course.program,
  ];
  // For nested fields, also include them:
  if (course.location) {
    parts.push(
      course.location.building,
      course.location.room,
      course.location.time
    );
  }
  // For arrays, like prerequisites or waitlist, join them:
  if (course.prerequisites?.length) {
    parts.push(course.prerequisites.join(" "));
  }
  if (course.waitlist?.length) {
    parts.push(course.waitlist.join(" "));
  }

  return parts
    .filter(Boolean)
    .map((p) => p.toLowerCase())
    .join(" ");
}

function ManageCoursesView({ filterText }) {
  const { API_HOST } = useApiHost();
  const [courses, setCourses] = useState(() => {
    const storedCourses = sessionStorage.getItem("courses");
    return storedCourses ? JSON.parse(storedCourses) : [];
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  // TODO: trying to prevent multiple fetches, but it seems to not work properly atm
  const hasFetched = useRef(false);

  const [selectedCourseWaitlist, setSelectedCourseWaitlist] = useState([]);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);

  // Fetch course list on component mount
  useEffect(() => {
    // If no courses loaded, fetch them
    if (courses.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${API_HOST}/admin/courses`, {
            withCredentials: true,
          });
          setCourses(response.data);
          sessionStorage.setItem("courses", JSON.stringify(response.data));
        } catch (error) {
          console.error(
            "Error fetching courses:",
            error.response?.data || error.message
          );
        }
      };
      fetchCourses();
    }
  }, [API_HOST, courses]);

  /**
   * Fetches students enrolled in the given course
   * @param {string} course_code 
   * @returns {Promise<void>}
   * @async
   */
  const fetchEnrolledStudents = async (course_code) => {
    try {
      const response = await axios.get(
        `${API_HOST}/admin/courses/${course_code}/students`,
        { withCredentials: true }
      );

      console.log("Response Data:", response.data);

      if (response.data.students && response.data.waitlisted) {
        setSelectedCourseStudents(response.data.students);
        setSelectedCourseWaitlist(response.data.waitlisted);
      } else {
        console.error("Unexpected response format:", response.data);
        setSelectedCourseStudents([]);
        setSelectedCourseWaitlist([]);
      }

      setIsStudentsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch enrolled students.");
      console.error("Error fetching students:", error);
    }
  };

  // Filter the courses based on filterText
  const filteredCourses = courses.filter((course) =>
    flattenCourseData(course).includes(filterText.toLowerCase())
  );

  // HANDLERS
  const handleEdit = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  /**
   * Delete a course by course code
   * @param {string} course_code 
   * @returns {Promise<void>}
   * @async
   */
  const handleDelete = async (course_code) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this course!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${API_HOST}/admin/courses/${course_code}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedCourses = courses.filter(
          (c) => c.course_code !== course_code
        );
        // Update state and session storage
        setCourses(updatedCourses);
        sessionStorage.setItem("courses", JSON.stringify(updatedCourses));
        Swal.fire("Deleted!", "Course has been deleted.", "success");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Cannot delete course with enrollments");
        } else if (error.response.status === 404) {
          toast.error("Course not found");
        } else {
          toast.error(
            `Error: ${error.response.status} - ${
              error.response.data.message || "Something went wrong"
            }`
          );
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  /**
   * Send updated course data to the server
   * @param {Object} updatedCourse 
   * @returns {Promise<void>}
   * @async
   */
  const handleUpdateCourse = async (updatedCourse) => {
    try {
      // send course code to server with a PUT request
      const response = await axios.put(
        `${API_HOST}/admin/courses/${updatedCourse.course_code}`,
        updatedCourse,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // update the course in the state and session storage
        const updatedCourses = courses.map((c) =>
          c.course_code === updatedCourse.course_code ? updatedCourse : c
        );
        setCourses(updatedCourses);
        sessionStorage.setItem("courses", JSON.stringify(updatedCourses));
        toast.success("Course updated successfully!");
        // close the modal
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Error updating course.");
      console.error(
        "Error updating course:",
        error.response?.data || error.message
      );
    }
  };


  return (
    <div className="p-4 bg-white rounded-md">
      <ul className="space-y-4">
        {filteredCourses.map((course) => (
          <li
            key={course.course_code}
            className="bg-gray-100 p-2 rounded-md shadow-md hover:shadow-lg transition-shadow flex justify-between"
          >
            {/* COURSE TITLE */}
            <div className="w-2/6">
              <h3 className="text-lg font-semibold text-gray-700">
                {course.course_code} - {course.course_name}
              </h3>
              <p className="text-gray-500">{course.description}</p>
            </div>
            {/* COURSE INFORMATION SECTION */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 w-3/6">
              <p>
                <span className="font-semibold">Instructor:</span>{" "}
                {course.instructor || "TBD"}
              </p>
              <p>
                <span className="font-semibold">Term:</span>{" "}
                {course.term || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Program:</span>{" "}
                {course.program || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Capacity:</span>{" "}
                {course.capacity}
              </p>
              <p>
                <span className="font-semibold">Enrolled:</span>{" "}
                {course.enrollments?.length || 0}
              </p>
              <p>
                <span className="font-semibold">Waitlist:</span>{" "}
                {course.waitlist?.length || 0}
              </p>
              <p>
                <span className="font-semibold">Prerequisites:</span>{" "}
                {course.prerequisites?.join(", ") || "None"}
              </p>
              <p>
                <span className="font-semibold">Building:</span>{" "}
                {course.location?.building || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Room:</span>{" "}
                {course.location?.room || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Time:</span>{" "}
                {course.location?.time || "TBD"}
              </p>
            </div>
            {/* BUTTONS */}
            <div className="flex space-x-2 items-center w-1/6 justify-end">
            <button
              className="button green-button"
              onClick={() => fetchEnrolledStudents(course.course_code)}
            >
              View Students
            </button>
            <button
              className="button blue-button"
              onClick={() => handleEdit(course)}
            >
              Edit
            </button>
            <button
              className="button red-button"
              onClick={() => handleDelete(course.course_code)}
            >
              Delete
            </button>
          </div>
          </li>
        ))}
      </ul>
      {/* If a course is selected, the modal will appear for editing */}
      {selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          // Modal will close when the user clicks the close button by setting selectedCourse to null
          onClose={handleCloseModal}
          // When the user clicks save, the updated course will be sent to the server
          onSave={handleUpdateCourse}
        />
      )}
      {isStudentsModalOpen && (
        <CourseStudentsModal
          students={selectedCourseStudents}
          waitlisted={selectedCourseWaitlist}
          onClose={() => setIsStudentsModalOpen(false)}
        />
      )}
    </div>
  );
}

ManageCoursesView.propTypes = {
  filterText: PropTypes.string.isRequired,
};

export default ManageCoursesView;
