import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faHeadset,
  faUsers,
  faLayerGroup,
  faNoteSticky,
  faBell,
  faUser
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevents page refresh
    // Perform validation here (if needed)
    navigate("/"); // Redirect to the dashboard after login
  };
  return (
    <div className="d-flex">
      <div
        className="vh-100 p-3 shadow-lg position-fixed d-flex text-primary flex-column justify-content-between"
        style={{ width: "250px", background: "linear-gradient(to right, #340D86, #340D86)"}}
      >
        {/* Navigation Links */}
        <div className="d-flex flex-column flex-grow-1">
          <Link to="/category" className="text-white text-decoration-none d-flex align-items-center py-2 px-3 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
            Category
          </Link>
          <Link to="/user-list" className="text-white text-decoration-none d-flex align-items-center py-2 px-3 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Users
          </Link>
          <Link to="/products" className="text-white text-decoration-none d-flex align-items-center py-2 px-3 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faNoteSticky} className="me-2" />
            Products
          </Link>
          <Link to="/order-list" className="text-white text-decoration-none d-flex align-items-center py-2 px-3 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Orders
          </Link>
        </div>

        {/* Footer Links */}
        <div>
          <Link to="/privacy" className="text-white text-decoration-none d-flex align-items-center py-2 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faHeadset} className="me-2" />
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-white text-decoration-none d-flex align-items-center py-2 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Terms & Conditions
          </Link>
          <Link to="/contact" className="text-white text-decoration-none d-flex align-items-center py-2 rounded fs-5 hover-effect">
            <FontAwesomeIcon icon={faGear} className="me-2" />
            Contact Us
          </Link>
          <div className="d-flex align-items-center justify-content-center mt-4 mb-4"><button className='bg-light text-primary fw-bold btn' onClick={handleLogin}>logout</button></div>
        </div>

        {/* User Profile */}
        {/* <div className="d-flex align-items-center justify-content-center pb-3">
          <Link to="/profile" className="text-decoration-none d-flex align-items-center">
            <img
              src="https://static.vecteezy.com/system/resources/previews/027/312/306/non_2x/portrait-of-a-dj-with-headphone-isolated-essential-workers-avatar-icons-characters-for-social-media-and-networking-user-profile-website-and-app-3d-render-illustration-png.png"
              alt="Profile"
              className="rounded-circle bg-white me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="text-white fw-semibold">{userName}</span>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
