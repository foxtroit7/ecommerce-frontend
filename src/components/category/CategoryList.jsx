import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token
  
      const response = await axios.get("http://65.1.108.80:5000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
      });
  
      setCategories(response.data); // Assuming API returns an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("authToken");
  
      await axios.delete(`http://65.1.108.80:5000/api/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchCategories(); // Refresh categories after deletion
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
                        <Link to={`/add-category/${category.category_id}`}>
                          <button className="btn btn-sm btn-warning text-light me-2">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm text-light"
                          onClick={() => deleteCategory(category.category_id)}
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
    </div>
  );
};

export default CategoryList;
