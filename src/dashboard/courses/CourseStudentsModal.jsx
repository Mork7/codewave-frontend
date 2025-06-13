import PropTypes from "prop-types";

export default function CourseStudentsModal({ students, waitlisted, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="big-popup-box">
        <h2 className="text-lg font-bold mb-4">Course Students</h2>

        {/* Enrolled Students Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Enrolled Students</h3>
          {students.length > 0 ? (
            <ul className="list-disc pl-4">
              {students.map((student) => (
                <li key={student.student_id} className="mb-2">
                  <p className="text-gray-700 font-semibold">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-gray-600 text-sm">{student.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students enrolled.</p>
          )}
        </div>

        {/* Waitlisted Students Section */}
        <div>
          <h3 className="text-md font-semibold mb-2">Waitlisted Students</h3>
          {waitlisted.length > 0 ? (
            <ul className="list-disc pl-4">
              {waitlisted.map((student) => (
                <li key={student.student_id} className="mb-2">
                  <p className="text-gray-700 font-semibold">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-gray-600 text-sm">{student.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students on the waitlist.</p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="button red-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

CourseStudentsModal.propTypes = {
  students: PropTypes.array.isRequired,
  waitlisted: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};
