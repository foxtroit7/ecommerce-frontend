import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Stores category_id
  const [offerPrice, setOfferPrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [description, setDescription] = useState("");

  // Fetch product details if editing
  useEffect(() => {
    if (product_id) {
      const token = localStorage.getItem("authToken");
      fetch(`http://65.1.108.80:5000/api/get-product/${product_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setName(data.product_name);
            setCategory(data.category);
            setCategoryId(data.category_id); // Ensure category_id is set
            setOfferPrice(data.offer_price);
            setActualPrice(data.actual_price);
            setDescription(data.description);
          }
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [product_id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://65.1.108.80:5000/api/category", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Invalid data format:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    // Find the corresponding category ID
    const selectedCategoryData = categories.find(cat => cat.category === selectedCategory);
    setCategoryId(selectedCategoryData ? selectedCategoryData.category_id : ""); // Ensure we store the correct category_id
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!name || !categoryId || !offerPrice || !actualPrice || !description) {
      alert("Please fill in all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", name);
    formData.append("category_id", categoryId); // Now correctly setting category_id
    formData.append("offer_price", offerPrice);
    formData.append("actual_price", actualPrice);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    const url = product_id
      ? `http://65.1.108.80:5000/api/edit-product/${product_id}`
      : `http://65.1.108.80:5000/api/create-product`;

    const method = product_id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/products");
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card border-0 p-4 rounded-4 shadow-lg">
        <h2 className="text-center text-gradient text-uppercase fw-bold mb-4">
          {product_id ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Product Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Image:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category}>
                    {cat.category}
                  </option>
                ))
              ) : (
                <option disabled>Loading categories...</option>
              )}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Offer Price:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Offer Price"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Actual Price:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Actual Price"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description:</label>
            <textarea
              className="form-control"
              placeholder="Enter Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            {product_id ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

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

export default AddProduct;
