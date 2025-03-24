import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  const [content, setContent] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchContactContent();
  }, []);

  // ✅ Fetch Contact Details
  const fetchContactContent = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token
      const response = await axios.get("http://localhost:5000/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContent(response.data.content);
      setLastUpdated(new Date(response.data.lastUpdated).toLocaleString());
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };

  // ✅ Handle Edit Click
  const handleEditClick = () => {
    setModalContent(content);
    setShowModal(true);
  };

  // ✅ Save Updated Contact Content
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token

      await axios.put(
        "http://localhost:5000/api/contact",
        { content: modalContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent(modalContent);
      setLastUpdated(new Date().toLocaleString()); // Update timestamp
      setShowModal(false);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Contact Card */}
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h2 className="text-gradient fw-bold text-center">Contact Us</h2>
        <p className="text-primary">Last updated: {lastUpdated}</p>
        <p className="mt-3">{content}</p>

        {/* Edit Button */}
        <button className="btn btn-primary mt-3 mx-auto d-block" onClick={handleEditClick}>
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Content</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="5"
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #2B81D1, #340D86);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Contact;
