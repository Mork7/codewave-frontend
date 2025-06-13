import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { FiCalendar, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify"; // To show messages when a course is dropped
import axios from "axios";
import { useApiHost } from "../hooks";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

ChartJS.register(ArcElement, Tooltip, Legend);

function StudentCourseManager({ courseData, setCourseData }) {
  const { API_HOST } = useApiHost();

  // Local state for edit mode and form values

  // Calculate the total grade, completed and in-progress courses, and average grade
  const gradeTotal = Number(
    courseData.reduce((acc, course) => acc + Number(course.grade), 0)
  );

  // Count the number of completed and in-progress courses
  const completedCount = courseData.filter(
    (course) => course.status === "Completed"
  ).length;

  // Calculate the number of in-progress courses
  const inProgressCount = courseData.length - completedCount;

  // Calculate the average grade
  const average =
    completedCount > 0 ? (gradeTotal / completedCount).toFixed(2) : 0;

  // Chart Data
  const chartData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [(completedCount / 40) * 100, 100 - (completedCount / 40) * 100], // Adjusted proportions
        backgroundColor: ["#4CAF50", "#FFA726"],
        borderColor: ["#388E3C", "#F57C00"],
        borderWidth: 1,
      },
    ],
  };

  // Function to handle dropping a course
  const handleDropCourse = async (course_code) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be removed from this course!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, drop it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_HOST}/student/drop/${course_code}`, {
          withCredentials: true,
        });

        Swal.fire(
          "Dropped!",
          "You have been removed from the course.",
          "success"
        );

        // Update UI by removing the dropped course
        setCourseData((prevCourses) =>
          prevCourses.filter((course) => course.course_code !== course_code)
        );
        toast.success("Course dropped successfully!");
      } catch (error) {
        console.error("Error dropping course:", error);
        Swal.fire("Error", "Failed to drop the course. Try again.", "error");
      }
    }
  };

  return (
    <div className="pt-20 bg-white min-h-screen bg-opacity-65 rounded-tr-[10rem] w-[60rem] shadow-2xl shadow-slate-700 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-2xl relative">
        <Link to="/schedule">
          <FiCalendar
            className="text-blue-600 text-3xl absolute top-4 right-4 cursor-pointer hover:text-blue-800 transition-colors"
            title="View Schedule"
          />
        </Link>
        <h1 className="text-3xl text-blue-800 font-bold mb-4 text-center pb-4">
          Degree Progress
        </h1>
        <div className="relative w-full" style={{ minHeight: "200px" }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  padding: 20,
                },
              },
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <p>
            Completed: {completedCount} | In Progress: {inProgressCount}
          </p>
          <p>GPA: {average}</p>
        </div>
        <h2 className="text-xl font-bold mb-4">Course Details</h2>
        <div className="mt-6 flex flex-col overflow-y-scroll h-[40vh]">
          {courseData
            .sort((a, b) => {
              if (a.status === "In Progress" && b.status === "Completed")
                return -1;
              if (a.status === "Completed" && b.status === "In Progress")
                return 1;
              return 0;
            })
            .map((course) => (
              <div
                key={course.course_code}
                className="flex justify-between relative border rounded p-2"
              >
                <div className="mb-2 w-3/4">
                  <p>
                    <span className="font-bold">Course:</span>{" "}
                    {course.course_code} - {course.course_name}
                  </p>
                  <p>
                    <span className="font-bold">Instructor:</span>{" "}
                    {course.instructor}
                  </p>
                  <p>
                    <span className="font-bold">Location:</span>{" "}
                    {course.location
                      ? `${course.location.building}, Room ${course.location.room}, Time: ${course.location.time}`
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-bold">Grade:</span>{" "}
                    {course.status === "In Progress" ? "TBD" : course.grade}
                  </p>
                  <p>
                    <span className="font-bold">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded ${
                        course.status === "Completed"
                          ? "bg-green-200"
                          : "bg-yellow-200"
                      }`}
                    >
                      {course.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Term:</span> {course.term}
                  </p>
                </div>
                {course.status === "In Progress" && (
                  <button
                    onClick={() => handleDropCourse(course.course_code)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors p-1"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
StudentCourseManager.propTypes = {
  courseData: PropTypes.array.isRequired,
  setCourseData: PropTypes.func.isRequired,
};

export default StudentCourseManager;
