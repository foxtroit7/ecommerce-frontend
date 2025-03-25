import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async (query = "") => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

      const url = query
        ? `http://65.1.108.80:5000/api/user/details?name=${query}`
        : "http://65.1.108.80:5000/api/user/details";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(Array.isArray(response.data) ? response.data : [response.data]); // Ensure data is in array format
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Clear users if error occurs
    } finally {

    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);



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
  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchUsers(); // Fetch all users if search is empty
    } else {
      fetchUsers(value); // Fetch filtered user by user_id
    }
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
          placeholder="Search by User Name"
          value={searchTerm}
          onChange={handleSearch}
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
                    <td>{user.address}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.status ? "btn-success" : "btn-secondary"}`}
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
