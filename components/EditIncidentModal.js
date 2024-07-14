import React, { useState } from "react";

const EditIncidentModal = ({ incident, onClose, onUpdate }) => {
  // Create local state to track the changes to the incident
  const [editedIncident, setEditedIncident] = useState({
    id: incident.id,
    // Add other fields you want to edit here
    complainer_name: incident.complainer_name,
    complainer_email: incident.complainer_email,
    complaint_text: incident.complaint_text,
    complaint_for: incident.complaint_for,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the edited incident state with the new value
    setEditedIncident({ ...editedIncident, [name]: value });
  };

  const handleSubmit = () => {
    // Call the onUpdate callback with the edited incident data
    onUpdate(editedIncident);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Incident</h2>
        <form>
          <div className="form-group">
            <label htmlFor="complainer_name">Name:</label>
            <input
              type="text"
              name="complainer_name"
              value={editedIncident.complainer_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="complainer_email">Email:</label>
            <input
              type="text"
              name="complainer_email"
              value={editedIncident.complainer_email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="complaint_text">Complaint Text:</label>
            <textarea
              name="complaint_text"
              value={editedIncident.complaint_text}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="complaint_for">Complaint For:</label>
            <input
              type="text"
              name="complaint_for"
              value={editedIncident.complaint_for}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <button type="button" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncidentModal;
