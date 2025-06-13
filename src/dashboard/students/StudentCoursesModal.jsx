import PropTypes from "prop-types";

export default function StudentCoursesModal({ student, courses, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="big-popup-box">
        <h2 className="text-lg font-bold mb-4">Enrolled Courses</h2>
        <p className="text-gray-700 font-semibold mb-2">
          {student.first_name} {student.last_name} (ID: {student.user_id})
        </p>

        {courses.length > 0 ? (
          <ul className="list-disc pl-4 space-y-2">
            {courses.map((course) => (
              <li key={course.course_code} className="text-gray-700">
                <p>
                  <span className="font-semibold">{course.course_code}:</span>{" "}
                  {course.course_name}
                </p>
                <p className="text-gray-600">
                  Instructor: {course.instructor || "TBD"} | Term: {course.term}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No courses enrolled.</p>
        )}

        <div className="flex justify-end mt-4">
          <button
            className="button red-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

StudentCoursesModal.propTypes = {
  student: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};
