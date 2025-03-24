import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddCategory = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(""); // For existing image in edit mode
  const [loading, setLoading] = useState(false);
  const { category_id } = useParams(); // Get category_id from URL
  const navigate = useNavigate();

  // Fetch Category by ID (For Editing)
  useEffect(() => {
    if (category_id) {
      const fetchCategory = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `http://65.1.108.80:5000/api/category/${category_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setTitle(response.data.category);
          setExistingImage(response.data.photo);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

      fetchCategory();
    }
  }, [category_id]);

  // Handle Form Submission (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a category title!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("category", title);
      if (image) {
        formData.append("photo", image);
      }

      if (category_id) {
        // Update Category API
        await axios.put(
          `http://65.1.108.80:5000/api/category/${category_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Category Updated Successfully!");
      } else {
        // Add Category API
        await axios.post("http://65.1.108.80:5000/api/category", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Category Added Successfully!");
      }

      navigate("/category"); // Redirect to category list
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card border-0 p-4 rounded-4 shadow-lg">
        {/* Page Title */}
        <h2 className="text-center text-gradient text-uppercase fw-bold mb-4">
          {category_id ? "Edit Category" : "Add Category"}
        </h2>

        {/* Category Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Category Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Category Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Upload Image:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Show Existing Image in Edit Mode */}
          {existingImage && !image && (
            <div className="text-center mb-3">
              <label className="fw-bold">Current Image:</label>
              <img
                src={existingImage}
                alt="Existing Category"
                className="rounded shadow"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
            {loading ? "Processing..." : category_id ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      {/* Custom CSS */}
      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #2B81D1, #340D86);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card {
          max-width: 500px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AddCategory;
