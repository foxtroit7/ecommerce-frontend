import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  
      const response = await axios.get("http://65.1.108.80:5000/api/user/details", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
  
      setUsers(response.data); // Assuming API returns an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user status (for frontend display only)
  const toggleActivity = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  // Filter Users based on search & status
  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || (filterStatus === "active" && user.status) || (filterStatus === "inactive" && !user.status))
    );
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-uppercase fw-bold mb-4 text-gradient">
        User List
      </h2>

      {/* Search & Filter Controls */}
      <div className="d-flex mb-3 gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-danger" onClick={resetFilters}>Reset</button>
      </div>

      {/* User Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="custom-header">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th>User ID</th>
                  <th>Address</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="custom-row">
                    <td className="fw-bold">{index + 1}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.user_id}</td>
                    <td>{user.address}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.status ? "btn-success" : "btn-secondary"}`}
                        onClick={() => toggleActivity(user._id)}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #2B81D1, #340D86);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-header {
          background: linear-gradient(to right, #2B81D1, #340D86);
          color: white;
          font-size: 18px;
          text-transform: uppercase;
        }
        .custom-row:hover {
          background: rgba(52, 13, 134, 0.1);
          transition: 0.3s;
        }
        .card {
          border-radius: 10px;
          overflow: hidden;
        }
        .btn-sm {
          font-size: 14px;
          padding: 5px 10px;
        }
      `}</style>
    </div>
  );
};

export default UserList;
