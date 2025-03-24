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
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://65.1.108.80:5000/api/all-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

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
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: Token not found! Please log in again.");
      alert("Session expired. Please log in again.");
      return;
    }
  
    try {
      await axios.put(
        `http://65.1.108.80:5000/api/update-status/${selectedOrder.booking_id}`,
        { order_status: newStatus },
    
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
            placeholder="Search by Order ID or User ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
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
          <select className="form-control" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Filter by Price</option>
            <option value="low">Below $1000</option>
            <option value="medium">$1000 - $2000</option>
            <option value="high">Above $2000</option>
          </select>
        </div>
        <div className="col-md-2">
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
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Order Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order.booking_id}</td>
                      <td>{order.user_id}</td>
                      <td>{order.user_name}</td>
                      <td>{order.delivery_address}</td>
                      <td>{order.total_price}</td>
                      <td>
                <select className={`form-select ${statusColors[order.order_status]}`} value={order.order_status} onChange={(e) => handleChangeStatus(order, e.target.value)}>
                          <option value="Pending" className="bg-warning text-dark">Pending</option>
                          <option value="Processing" className="bg-primary text-white">Processing</option>
                          <option value="Shipped" className="bg-info text-dark">Shipped</option>
                          <option value="Delivered" className="bg-success text-white">Delivered</option>
                          <option value="Cancelled" className="bg-danger text-white">Cancelled</option>
                </select>
              </td>
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
                <p><strong>Booking ID:</strong> {selectedOrder.booking_id}</p>
                <p><strong>User ID:</strong> {selectedOrder.user_id}</p>
                <p><strong>Status:</strong> {selectedOrder.order_status}</p>
                <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                <hr />
                <h5>Products</h5>
                {selectedOrder.products.map((product) => (
                  <div key={product.product_id} className="mb-3">
                    <p><strong>Product Name:</strong> {product.product_name}</p>
                    <p><strong>Offer Price:</strong> ${product.offer_price}</p>
                    <p><strong>Actual Price:</strong> ${product.actual_price}</p>
                    <img src={`http://65.1.108.80:5000/${product.image}`} alt={product.product_name} width={100} />
                  </div>
                ))}
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
