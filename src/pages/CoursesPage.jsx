import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProfile, useApiHost } from "../hooks";
import { format } from 'date-fns';

function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { userData } = useProfile();
  const { API_HOST } = useApiHost();

  // Load saved search results and search term on mount
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      toast.error("Please log in to view this page.");
      navigate("/login");
    }

    const savedResults = sessionStorage.getItem("searchResults");
    const savedSearchTerm = sessionStorage.getItem("searchTerm");

    if (savedResults) {
      setSearchResults(JSON.parse(savedResults));
    }

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm); // Load saved search term
    }
  }, [isLoggedIn, navigate, isLoading]);

  // Save search term to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  /**
   * Fetch courses based on the search term
   * @param {Event} e - Form submission event
   * @returns {Promise<void>} 
   * @async
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${API_HOST}/courses/search`, {
        params: {
          search_term: searchTerm,
          email: userData.email,
        },
        withCredentials: true,
      });

      const results = response.data;
      setSearchResults(results);
      sessionStorage.setItem("searchResults", JSON.stringify(results)); // Save search results
    } catch (error) {
      console.error(
        "Error fetching courses:",
        error.response?.data || error.message
      );
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowConfirmation(true);
  };

  const handleRegister = () => {
    navigate("/course/register", { state: { course: selectedCourse } });
  };

  return (
    <section className="pt-24 px-10 flex justify-between gap-8">
      {/* Search Section */}
      <div className="flex flex-col w-1/3 bg-white p-6 rounded-lg shadow-xl max-h-96">
        <h1 className="text-2xl font-bold mb-4">Course Offerings</h1>
        <h2 className="text-gray-700 mb-6">
          Here is a list of courses that we offer. Please click on the course
          name to learn more about the course.
        </h2>
        <form
          method="GET"
          className="flex flex-col space-y-4"
          onSubmit={handleSearch}
        >
          <p className="text-sm text-gray-600">
            You can search by course name, description, instructor, term, or
            program name.
          </p>
          <label
            htmlFor="search-course"
            className="text-lg font-semibold text-gray-700"
          >
            Search Courses:
          </label>
          <input
            type="text"
            value={searchTerm} // Keep the search term in the input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC9EE5]"
            required
          />
          <button
          type="submit"
          className="button-base button-large"
        >
          Search
        </button>
        </form>
      </div>

      {/* Results Section */}
      {searchResults.length > 0 ? (
        <ul className="w-2/3 bg-gray-100 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[87vh]">
          {searchResults.map((course) => (
            <li
              key={course.course_code}
              className="mb-4 p-4 border-b border-gray-300 last:border-none"
            >
              <h3
                className="text-xl font-semibold text-blue-800 cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                {course.course_code}: {course.course_name} -{" "}
                <span className="!text-base text-gray-600">
                  {course.description}
                </span>
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">Instructor:</span>{" "}
                {course.instructor}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Program:</span> {course.program}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Term:</span> {course.term}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Start Date:</span>{" "}
                {course.start_date
                  ? format(
                      new Date(course.start_date + "T00:00:00"),
                      "yyyy-MM-dd"
                    )
                  : "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">End Date:</span>{" "}
                {course.end_date
                  ? format(
                      new Date(course.end_date + "T00:00:00"),
                      "yyyy-MM-dd"
                    )
                  : "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Prerequisites:</span>{" "}
                {course.prerequisites.length > 0
                  ? course.prerequisites.join(", ")
                  : "None"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Waitlisted:</span>{" "}
                {course.waitlist.length > 0 ? "Yes" : "No"}
              </p>
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Building:</span>{" "}
                  {course.location.building}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Room:</span>{" "}
                  {course.location.room}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Time:</span>{" "}
                  {course.location.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bg-gray-100 p-6 rounded-lg shadow-lg w-2/3 text-center h-18 self-center">
          No courses found.
        </p>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
            <h2 className="text-2xl font-bold mb-4">
              Register for {selectedCourse?.course_name}?
            </h2>
            <p>Would you like to register for this course?</p>
            <div className="mt-4 flex gap-4 justify-end">
              <button
                className="button-base button-small"
                onClick={handleRegister}
              >
                Yes
              </button>
              <button
                className="button-base button-small"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CoursesPage;
