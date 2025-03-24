import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Terms = () => {
  const [content, setContent] = useState("Loading terms...");
  const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsId, setTermsId] = useState(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://65.1.108.80:5000/api/terms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(response.data.content);
      setTermsId(response.data.id);
    } catch (error) {
      console.error("Error fetching terms:", error);
      setContent("Failed to load terms.");
    }
  };

  const handleEditClick = () => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://65.1.108.80:5000/api/terms/${termsId}`, {
        content: modalContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(modalContent);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating terms:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h2 className="text-gradient fw-bold text-center">Terms & Conditions</h2>
        <p className="text-primary">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-3">{content}</p>

        <button className="btn btn-primary mt-3 mx-auto d-block" onClick={handleEditClick}>
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Terms & Conditions</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="6" value={modalContent} onChange={(e) => setModalContent(e.target.value)}></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terms;
