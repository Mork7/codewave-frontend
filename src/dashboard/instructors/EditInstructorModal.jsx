import { useState } from "react";
import PropTypes from "prop-types";

function EditInstructorModal({ instructor, onClose, onSave }) {
  const [editedInstructor, setEditedInstructor] = useState({ ...instructor });

  const handleInputChange = (e) => {
    setEditedInstructor((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSave(editedInstructor);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="big-popup-box">
        <h2 className="text-lg font-bold mb-4">Edit Instructor</h2>

        <label className="block mb-2">First Name</label>
        <input
          type="text"
          name="first_name"
          value={editedInstructor.first_name || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 mb-2">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={editedInstructor.last_name || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={editedInstructor.email || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 mb-2">Program</label>
        <input
          type="text"
          name="program"
          value={editedInstructor.program || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />

        {/* You can add more fields as necessary */}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="button red-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="button blue-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

EditInstructorModal.propTypes = {
  instructor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditInstructorModal;
