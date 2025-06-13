import { useState } from "react";
import PropTypes from "prop-types";

function EditCourseModal({ course, onClose, onSave }) {
  const [editedCourse, setEditedCourse] = useState({
    ...course,
  });

  const handleInputChange = (e) => {
    setEditedCourse((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSave(editedCourse);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="big-popup-box">
        <h2 className="text-lg font-bold mb-4">Edit Course</h2>

        <label className="block mb-2">Course Name</label>
        <input
          type="text"
          name="course_name"
          value={editedCourse.course_name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 mb-2">Description</label>
        <textarea
          name="description"
          value={editedCourse.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        ></textarea>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="button blue-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="button red-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

EditCourseModal.propTypes = {
  course: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditCourseModal;
