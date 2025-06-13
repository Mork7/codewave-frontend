import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function EditStudentModal({ student, onClose, onSave }) {
  const [editedStudent, setEditedStudent] = useState({});

  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedStudent);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="big-popup-box">
        <h2 className="text-lg font-bold mb-4">Edit Student</h2>

        <label className="block mb-2">First Name</label>
        <input
          type="text"
          name="first_name"
          value={editedStudent.first_name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-2 mb-2">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={editedStudent.last_name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-2 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={editedStudent.email || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-2 mb-2">Program</label>
        <input
          type="text"
          name="program"
          value={editedStudent.program || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-2 mb-2">Phone</label>
        <input
          type="text"
          name="phone"
          value={editedStudent.phone || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="button red-button">
            Cancel
          </button>
          <button onClick={handleSave} className="button blue-button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

EditStudentModal.propTypes = {
  student: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
