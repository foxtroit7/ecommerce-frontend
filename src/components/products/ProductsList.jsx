import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let apiUrl = `http://65.1.108.80:5000/api/get-product`;
      if (searchTerm.trim()) {
        apiUrl = `http://65.1.108.80:5000/api/products/search?name=${searchTerm}`;
      }
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const confirmDelete = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://65.1.108.80:5000/api/delete-product/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-gradient text-uppercase fw-bold">Product List</h2>
        <Link to="/add-product">
          <button className="btn btn-primary fw-bold">+ Add Product</button>
        </Link>
      </div>
      
      <div className="p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 rounded-4 shadow-lg">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="custom-header">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Offer Price</th>
                  <th>Actual Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.product_name}</td>
                      <td>
                        <img
                          src={`http://65.1.108.80:5000/${product.image}`}
                          alt={product.name}
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td>{product.category}</td>
                      <td className="text-success fw-bold">₹{product.offer_price}</td>
                      <td className="text-decoration-line-through text-primary">₹{product.actual_price}</td>
                      <td>
                        <Link to={`/edit-product/${product.product_id}`}>
                          <button className="btn btn-sm btn-warning me-2">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(product.product_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-danger fw-bold">No products found!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #2B81D1, #340D86);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-header {
          background: linear-gradient(to right, #2B81D1, #340D86);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProductList;
