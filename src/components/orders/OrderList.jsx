import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleChangeStatus = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setShowConfirmModal(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriceRange("");
  };
  const statusColors = {
    Pending: "badge bg-warning text-dark",
    Processing: "badge bg-primary",
    Shipped: "badge bg-info text-dark",
    Delivered: "badge bg-success",
    Cancelled: "badge bg-danger",
  };
  const confirmStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Error: Token not found! Please log in again.");
      alert("Session expired. Please log in again.");
      return;
    }
  console.log(token)
    try {
      await axios.put(
        `http://65.1.108.80:5000/api/update-status/${selectedOrder.booking_id}`,
        { order_status: newStatus }, // Request body
        {
          headers: { Authorization: `Bearer ${token}` }, // Headers
        }
      );
      
  
      setOrders(orders.map(order =>
        order.booking_id === selectedOrder.booking_id
          ? { ...order, order_status: newStatus }
          : order
      ));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = "http://65.1.108.80:5000/api/all-bookings";
  
        if (searchTerm.trim() !== "") {
          url = `http://65.1.108.80:5000/api/search-booking?booking_id=${searchTerm}`;
        } else if (statusFilter.trim() !== "") {
          url = `http://65.1.108.80:5000/api/all-bookings?order_status=${statusFilter}`;
        }
  
        const response = await axios.get(url);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, [searchTerm, statusFilter]);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentOrders = orders.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? order.order_status === statusFilter : true;
    const matchesPrice = priceRange === "" || order.products.some(product => {
      const price = product.offer_price;
      return priceRange === "low" ? price < 1000 :
             priceRange === "medium" ? price >= 1000 && price <= 2000 :
             price > 2000;
    });

    return matchesSearch && matchesStatus && matchesPrice;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center text-uppercase fw-bold mb-4 text-gradient">Order List</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Filter by Status</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-danger w-100" onClick={resetFilters}>Reset</button>
        </div>
      </div>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Phone Number</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Order Status</th>
                  <th>Order Time</th>
                  <th>Actions</th>
                 
                </tr>
              </thead>
              <tbody>
              {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
              
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order.booking_id}</td>
                      <td>{order.phone_number}</td>
                      <td>{order.user_name}</td>
                      <td>{order.delivery_address}</td>
                      <td>₹{order.total_price}</td>
                      <td>
                <select className={`form-select ${statusColors[order.order_status]}`} value={order.order_status} onChange={(e) => handleChangeStatus(order, e.target.value)}>
                          <option value="Pending" className="bg-warning text-dark">Pending</option>
                          <option value="Processing" className="bg-primary text-white">Processing</option>
                          <option value="Shipped" className="bg-info text-dark">Shipped</option>
                          <option value="Delivered" className="bg-success text-white">Delivered</option>
                          <option value="Cancelled" className="bg-danger text-white">Cancelled</option>
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleString("en-GB", { 
  timeZone: "Asia/Kolkata", 
  day: "2-digit", 
  month: "short", 
  year: "numeric", 
  hour: "2-digit", 
  minute: "2-digit", 
  hour12: false 
}).replace(",", "")}</td>

                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => handleViewOrder(order)}>
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-danger fw-bold">No orders found!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
      </div>
    {/* Order Details Modal */}
    {showModal && selectedOrder && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Order Details</h5>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
      </div>
      <div className="modal-body">
        <div className="container">
          <div className="row">
            <div className="col-md-6"><p><strong>Booking ID:</strong> {selectedOrder.booking_id}</p></div>
            <div className="col-md-6"><p><strong>User Name:</strong> {selectedOrder.user_name}</p></div>
            <div className="col-md-6"><p><strong>Delivery Address:</strong> {selectedOrder.delivery_address}</p></div>
            <div className="col-md-6"><p><strong>Phone Number:</strong> {selectedOrder.phone_number}</p></div>
            <div className="col-md-6"><p><strong>Status:</strong> {selectedOrder.order_status}</p></div>
            <div className="col-md-6"><p><strong>Total Price:</strong> ₹{selectedOrder.total_price}</p></div>
            <div className="col-md-6"><p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
            <div className="col-md-6"><p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p></div>
          </div>
        </div>
        <hr />
        <h5>Products</h5>
        {selectedOrder.products.map((product) => (
          <div key={product.product_id} className="mb-3">
            <div className="row">
              <div className="col-md-4">
                <p><strong>Product Name:</strong> {product.product_name}</p>
                <p><strong>Offer Price:</strong> ₹{product.offer_price}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Actual Price:</strong> ₹{product.actual_price}</p>
                <img src={`http://65.1.108.80:5000/${product.image}`} alt={product.product_name} width={100} />
              </div>
            </div>
          </div>
        ))}
        <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
</div>
)}

         {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to change the status to "{newStatus}"?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmStatusChange}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
