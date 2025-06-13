import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect for fetching current courses
import axios from "axios"; // Import axios for making API requests
import { useProfile, useApiHost } from "../hooks";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { IoClose } from "react-icons/io5"; // Import an icon for the close button

function CourseRegistrationPage() {
  const { state } = useLocation();
  const { userData, role, setCourseData } = useProfile(); // Destructure role directly
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentCourses, setCurrentCourses] = useState([]); // State for current courses
  const [timeConflict, setTimeConflict] = useState(false); // State for time conflict
  const [conflictingCourses, setConflictingCourses] = useState([]); // State for conflicting courses
  const { API_HOST } = useApiHost();
  const navigate = useNavigate(); // For navigation after modal close

  // Log the state object to check what data is being passed
  console.log(state);

  if (!state || !state.course) {
    return <p>Course data not available. Please go back and try again.</p>;
  }

  const { course } = state;

  // Fetch the student's current "in progress" courses
  useEffect(() => {
    const fetchCurrentCourses = async () => {
      try {
        const response = await axios.get(`${API_HOST}/student/courses`, {
          withCredentials: true,
        });
        setCurrentCourses(response.data.filter(c => c.status === "In Progress"));
      } catch (error) {
        console.error("Error fetching current courses:", error);
        toast.error("Failed to fetch current courses. Please try again.");
      }
    };

    if (role === "student") {
      fetchCurrentCourses();
    }
  }, [API_HOST, role]); // Use role directly

  // Check for time conflicts
  useEffect(() => {
    if (currentCourses.length > 0) {
      const newCourseTime = parseTime(course.location.time);
      const conflicts = currentCourses.filter((currentCourse) => {
        const currentCourseTime = parseTime(currentCourse.location.time);
        return checkTimeConflict(newCourseTime, currentCourseTime);
      });

      if (conflicts.length > 0) {
        setTimeConflict(true);
        setConflictingCourses(conflicts); // Set conflicting courses
      } else {
        setTimeConflict(false);
        setConflictingCourses([]); // Clear conflicting courses
      }
    }
  }, [currentCourses, course.location.time]);

  /**
   * Parse the course time string into start and end times in minutes.
   * @param {string} timeStr - The course time string (e.g., "MWF 10:00 AM-11:30 AM").
   * @returns {Array} - An array of objects with start and end times for each day.
   */
  const parseTime = (timeStr) => {
    const [days, timeRange] = timeStr.split(" ");
    const [startTime, endTime] = timeRange.split("-");
    const [startHour, startMinute] = startTime.replace(/AM|PM/, "").split(":").map(Number);
    const [endHour, endMinute] = endTime.replace(/AM|PM/, "").split(":").map(Number);

    const isStartPM = startTime.includes("PM");
    const isEndPM = endTime.includes("PM");

    // Convert to military time in minutes from midnight
    const startTotalMinutes = (startHour % 12) * 60 + startMinute + (isStartPM && startHour !== 12 ? 12 * 60 : 0);
    const endTotalMinutes = (endHour % 12) * 60 + endMinute + (isEndPM && endHour !== 12 ? 12 * 60 : 0);

    // Map shorthand days to full day names
    const dayMap = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
    };

    return days.split(/(?=[A-Z])/).map((day) => ({
      day: dayMap[day],
      startTotalMinutes,
      endTotalMinutes,
    }));
  };

  /**
   * Check if two course times overlap.
   * @param {Array} newCourseTime - The parsed time of the new course.
   * @param {Array} currentCourseTime - The parsed time of the current course.
   * @returns {boolean} - True if there is a time conflict, false otherwise.
   */
  const checkTimeConflict = (newCourseTime, currentCourseTime) => {
    for (const newTime of newCourseTime) {
      for (const currentTime of currentCourseTime) {
        if (
          newTime.day === currentTime.day &&
          newTime.startTotalMinutes < currentTime.endTotalMinutes &&
          newTime.endTotalMinutes > currentTime.startTotalMinutes
        ) {
          return true; // Time conflict found
        }
      }
    }
    return false; // No time conflict
  };

  /**
   * Function to handle the enrollment of a student to a course
   * This function sends a POST request to the server to enroll the student
   * @returns {Promise<void>} A promise that resolves when the request is complete
   * @async
   */
  const handleEnroll = async () => {
    if (role !== "student") {
      toast.error("Only students can register for courses.");
      return;
    }

    if (timeConflict) {
      toast.error("This course conflicts with your current schedule.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_HOST}/student/enroll`,
        {
          email: userData.email,
          course_code: course.course_code,
          term: course.term,
        },
        { withCredentials: true }
      );

      // Check if the student was added to the waitlist
      if (response.data.waitlist) {
        toast.info("The course is full. You have been added to the waitlist.");
      } else {
        toast.success("Course enrolled successfully!");
        setCourseData((prevData) => [...prevData, response.data.enrollment]);
        setIsEnrolled(true);
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("Unable to complete the request. Please try again.");
      }
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Ensure userData is loaded before rendering
  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-100 h-full p-6 rounded-xl relative">
        <section className="big-popup-box">
          <div className="flex justify-between items-center mb-4 space-x-4 ">
            <h1 className="text-3xl font-semibold text-blue-800">
              Registering for {course.course_name}
            </h1>
            <button
              onClick={handleClose}
              className=" bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300 transition rounded-lg p-2"
              title="Close"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-2">
              <strong>Course Code:</strong> {course.course_code}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Description:</strong> {course.description}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Program:</strong> {course.program}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Term:</strong> {course.term}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Start Date:</strong>{" "}
              {course.start_date
                ? format(
                    new Date(course.start_date + "T00:00:00"),
                    "yyyy-MM-dd"
                  )
                : "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>End Date:</strong>{" "}
              {course.end_date
                ? format(new Date(course.end_date + "T00:00:00"), "yyyy-MM-dd")
                : "N/A"}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Prerequisites:</strong>{" "}
              {course.prerequisites.length > 0
                ? course.prerequisites.join(", ")
                : "None"}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Waitlisted:</strong>{" "}
              {course.waitlist.length > 0 ? "Yes" : "No"}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Location:</span>
              <ul>
                <li>Building: {course.location.building}</li>
                <li>Room: {course.location.room}</li>
                <li>Time: {course.location.time}</li>
              </ul>
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleEnroll}
              disabled={isEnrolled || timeConflict || role !== "student"} // Disable if enrolled, time conflict, or not a student
              className={`p-3 font-semibold rounded-lg shadow-md transition duration-300 ${
                isEnrolled || timeConflict || role !== "student"
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "button-base button-enroll"
              }`}
            >
              {isEnrolled ? "Enrolled" : "Enroll"}
            </button>
          </div>

          {timeConflict && (
            <div className="mt-4 p-4 border border-black rounded-lg text-left">
              <p className="text-red-600 font-bold">
                This course conflicts with your current schedule.
              </p>
              <p className="text-black mt-2 font-bold">
                Check course(s):
              </p>
              <ul className="list-disc list-inside pl-5">
                {conflictingCourses.map((conflict, index) => (
                  <li key={index}>
                    {conflict.course_name} ({conflict.course_code}) - {conflict.location.time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {role !== "student" && (
            <p className="text-red-600 text-center mt-4">
              Only students can register for courses.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default CourseRegistrationPage;