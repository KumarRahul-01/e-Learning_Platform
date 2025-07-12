import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profileImage from "../../assets/profile.webp";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Auth logic from your MUI header
  const user = localStorage.getItem("name");
  const proImg = localStorage.getItem("proimg");
  const token = localStorage.getItem("token");

  const handleProfileClick = () => setDropdownOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <NavLink
        to="/"
        className="navbar-brand d-flex align-items-center px-4 px-lg-5"
      >
        <h2 className="m-0 text-primary">
          <i className="fa fa-book me-3"></i>eLEARNING
        </h2>
      </NavLink>
      <button
        type="button"
        className="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <NavLink to="/" className="nav-item nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-item nav-link">
            About
          </NavLink>
          <NavLink to="/courses" className="nav-item nav-link">
            Courses
          </NavLink>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
            >
              Blog
            </a>
            <div className="dropdown-menu fade-down m-0">
              <NavLink to="/team" className="dropdown-item">
                Our Team
              </NavLink>
              <NavLink to="/testimonial" className="dropdown-item">
                Testimonial
              </NavLink>
              <NavLink to="/course-catalog" className="dropdown-item">
                Course Catalog
              </NavLink>
              <NavLink to="/quiz" className="dropdown-item">
                Quiz
              </NavLink>
              <NavLink to="/404" className="dropdown-item">
                404 Page
              </NavLink>
            </div>
          </div>
          <NavLink to="/contact" className="nav-item nav-link">
            Contact
          </NavLink>

          {/* Auth/Profile logic */}
          {!token ? (
            <>
              <NavLink to="/signin" className="nav-item nav-link">
                Sign In
              </NavLink>
              <NavLink to="/signup" className="nav-item nav-link">
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle d-flex align-items-center"
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleProfileClick();
                }}
                aria-expanded={dropdownOpen}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={proImg ? proImg : profileImage}
                  alt="Profile"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #eee",
                    marginRight: 8,
                  }}
                />
                <span>{user || "User"}</span>
              </a>
              <div
                className={`dropdown-menu dropdown-menu-end fade-down m-0${
                  dropdownOpen ? " show" : ""
                }`}
                style={{ right: 0, left: "auto" }}
              >
                <span className="dropdown-item disabled">
                  <i className="fa fa-user me-2"></i>
                  {user || "Guest"}
                </span>
                <div className="dropdown-divider"></div>
                <NavLink
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fa fa-calendar-check me-2"></i>
                  Profile
                </NavLink>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
