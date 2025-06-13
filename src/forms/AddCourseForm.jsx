import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useApiHost } from "../hooks";
import { toast } from "react-toastify";

// Mapping of course prefixes to programs
const prefixToProgram = {
  COMP: "Computer Science",
  MATH: "Mathematics",
  ENG: "Engineering",
  BUSI: "Business",
  ARTS: "Arts",
  GENE: "General Studies",
};

// Static data for dropdowns
const coursePrefixes = ["COMP", "MATH", "GENE", "ENG", "BUSI", "ARTS"];
const buildings = [
  "Erie Hall",
  "Chrysler North",
  "Chrysler South",
  "Dillon Hall",
  "Biology",
  "Odette",
  "Lambton",
];
const terms = ["Winter 2025", "Fall 2025"];


export default function AddCourseForm({ setActiveView }) {
  // consuming api
  const { API_HOST } = useApiHost();
  // State for form data
  const [courseData, setCourseData] = useState({
    course_prefix: "",
    course_number: "",
    course_code: "",
    course_name: "",
    description: "",
    program: "",
    instructor: "",
    term: "",
    capacity: "",
    building: "",
    room: "",
    time: "",
    start_date: "",
    end_date: "",
    prerequisites: [],
    waitlist: [],
  });

  // State for dynamic dropdowns
  const [instructors, setInstructors] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch courses for prerequisites dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_HOST}/admin/courses`, {
          withCredentials: true,
        });
        setAvailableCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error.response?.data || error.message
        );
      }
    };
    fetchCourses();
  }, [API_HOST]);

  // Fetch instructors when program changes
  useEffect(() => {
    if (!courseData.program) {
      setInstructors([]);
      return;
    }

    const fetchInstructors = async () => {
      try {
        const response = await axios.get(
          `${API_HOST}/admin/instructors?program=${encodeURIComponent(
            courseData.program
          )}`,
          {
            withCredentials: true,
          }
        );

        // make sure that only instructors who are teaching less than 4 courses are available
        const filteredInstructors = response.data.filter(instructor => (instructor.courses?.length  || 0) < 4);
        setInstructors(filteredInstructors);
      } catch (error) {
        console.error(
          "Error fetching instructors:",
          error.response?.data || error.message
        );
      }
    };

    fetchInstructors();
  }, [API_HOST, courseData.program]);

  // Update course data when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // If the course_prefix is updated, auto-generate the program
      if (name === "course_prefix") {
        updatedData.program = prefixToProgram[value] || "";
      }

      // Auto-generate course_code when prefix and number are entered
      if ((name === "course_prefix" || name === "course_number") && updatedData.course_prefix && updatedData.course_number) {
        updatedData.course_code = `${updatedData.course_prefix}-${updatedData.course_number}`;
      }

      return updatedData;
    });
  };

  /**
   * Add prerequisites to the course data
   * @param {string} selectedValue 
   * @returns {object} Updated prerequsite course data
   */
  const handlePrerequisitesChange = (selectedValue) => {
    setCourseData((prev) => {
      const updatedPrerequisites = prev.prerequisites.includes(selectedValue)
        ? prev.prerequisites.filter((course) => course !== selectedValue) // Remove if already selected
        : [...prev.prerequisites, selectedValue]; // Add if new selection

      return {
        ...prev,
        prerequisites: updatedPrerequisites,
      };
    });
  };

  // Handle form submission. Send a payload to the API to create a new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...courseData,
        course_code: `${courseData.course_prefix}-${courseData.course_number}`,
        // make sure capacity is an integer of base 10
        capacity: parseInt(courseData.capacity, 10),
      };

      const response = await axios.post(`${API_HOST}/admin/courses`, payload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Course added successfully!");
        setActiveView("Courses");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(
        "Error adding course:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full h-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Code Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Code (Auto-generated)
          </label>
          <div className="flex space-x-2">
            {/* Course Prefix Dropdown */}
            <select
              name="course_prefix"
              value={courseData.course_prefix}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded-md"
              required
            >
              <option value="">Select Prefix</option>
              {coursePrefixes.map((prefix) => (
                <option key={prefix} value={prefix}>
                  {prefix}
                </option>
              ))}
            </select>

            {/* Course Number Input */}
            <input
              type="text"
              name="course_number"
              placeholder="Course Number (e.g., 1400)"
              value={courseData.course_number}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded-md"
              required
            />
          </div>

          {/* Final Course Code Display */}
          {courseData.course_code && (
            <p className="mt-2 text-sm text-gray-700">
              Final Course Code: <strong>{courseData.course_code}</strong>
            </p>
          )}
        </div>

        <input
          type="text"
          name="course_name"
          placeholder="Course Name"
          value={courseData.course_name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={courseData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        {/* Program is now auto-set based on prefix */}
        <div className="flex space-x-2">
          <input
            type="text"
            name="program"
            value={courseData.program}
            readOnly
            className="w-1/3 p-2 border rounded-md bg-gray-100"
            placeholder="Program"
          />

          {/* Instructor Dropdown */}
          <select
            name="instructor"
            value={courseData.instructor}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded-md"
            required
          >
            <option value="">Select Instructor</option>
            {instructors.length === 0 ? (
              <option>TBA</option>
            ) : (
              instructors.map((inst) => (
                <option
                  key={inst.id}
                  value={`${inst.first_name} ${inst.last_name}`}
                >
                  {inst.first_name} {inst.last_name}
                </option>
              ))
            )}
          </select>

          {/* Term Dropdown */}
          <select
            name="term"
            value={courseData.term}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded-md"
            required
          >
            <option value="">Select Term</option>
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <input
            type="number"
            name="capacity"
            placeholder="Course Capacity"
            value={courseData.capacity}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded-md"
            required
          />

          {/* Building Dropdown */}
          <select
            name="building"
            value={courseData.building}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded-md"
            required
          >
            <option value="">Select Building</option>
            {buildings.map((bld) => (
              <option key={bld} value={bld}>
                {bld}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="room"
            placeholder="Room Number"
            value={courseData.room}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded-md"
            required
          />
        </div>

        <input
          type="text"
          name="time"
          placeholder="Class Time (e.g., MW 10:00-11:00)"
          value={courseData.time}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        {/* Prerequisites Multi-Select */}
        <select
          name="prerequisites"
          className="w-full p-2 border rounded-md"
          onChange={(e) => handlePrerequisitesChange(e.target.value)}
        >
          <option value="">Select Prerequisites</option>
          {availableCourses
            .filter(
              (course) =>
                !courseData.prerequisites.includes(course.course_code)
            ) // Hide already selected
            .map((course) => (
              <option key={course.course_code} value={course.course_code}>
                {course.course_code} - {course.course_name}
              </option>
            ))}
        </select>

        {courseData.prerequisites.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 rounded-md">
            <p className="text-sm font-semibold">Selected Prerequisites:</p>
            <ul className="list-disc pl-5 text-sm">
              {courseData.prerequisites.map((courseCode) => (
                <li key={courseCode}>{courseCode}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setActiveView("Courses")}
            className="button red-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button blue-button"
          >
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}

AddCourseForm.propTypes = {
  setActiveView: PropTypes.func.isRequired,
};
