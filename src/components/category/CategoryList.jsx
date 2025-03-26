import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token
      const response = await axios.get("http://65.1.108.80:5000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://65.1.108.80:5000/api/category/${categoryToDelete.category_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-gradient text-uppercase fw-bold">Category List</h2>
        <Link to="/add-category">
          <button className="btn btn-primary fw-bold">+ Add Category</button>
        </Link>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Category Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 rounded-4 shadow-lg">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="custom-header">
                <tr>
                  <th>#</th>
                  <th>Category Title</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <tr key={category.category_id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td className="fw-semibold">{category.category}</td>
                      <td>
                        <img
                          src={`http://65.1.108.80:5000/${category.photo}`}
                          alt={category.category}
                          className="rounded-circle shadow"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        <Link to={`/edit-category/${category.category_id}`}>
                          <button className="btn btn-sm btn-warning text-light me-2">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm text-light"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-danger fw-bold">
                      No categories found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && categoryToDelete && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <b>{categoryToDelete.category}</b>?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default CategoryList;
