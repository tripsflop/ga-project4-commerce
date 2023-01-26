import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

const Navigation = () => {
  const style = ({ isActive }) => ({
    paddingLeft: "10px",
    paddingRight: "10px",
    fontWeight: isActive ? "bold" : "normal",
  });

  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user._id);

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 fixed-top">
        <div className="container">
          <a className="navbar-brand d-flex justify-content-between align-items-center order-lg-0">
            {/* <img src="../public/icons8-trainers-64.png" alt="site icon" /> */}
            <span className="text-uppercase fw-bold ms-2">STRIDES</span>
          </a>

          <div className="order-lg-2 nav-btns">
            <NavLink
              className="text-uppercase text-dark"
              style={style}
              to="/cart"
            >
              {`Cart(${quantity})`}
            </NavLink>
          </div>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse order-lg-1" id="navMenu">
            <ul className="navbar-nav mx-auto text-center">
              <li className="nav-item px-2 py-2">
                <NavLink
                  style={style}
                  className="text-uppercase text-dark"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item px-2 py-2">
                <NavLink
                  style={style}
                  className="text-uppercase text-dark"
                  to="/explore"
                >
                  Explore
                </NavLink>
              </li>
              <li className="nav-item px-2 py-2">
                <NavLink
                  style={style}
                  className="text-uppercase text-dark"
                  hidden={user ? true : false}
                  to="/account"
                >
                  Account
                </NavLink>
              </li>
              <li className="nav-item px-2 py-2">
                <NavLink
                  style={style}
                  className="text-uppercase text-dark"
                  hidden={user ? false : true}
                  to="/profile"
                >
                  Profile
                </NavLink>
              </li>
              <li className="nav-item px-2 py-2">
                <NavLink
                  style={style}
                  className="text-uppercase text-dark"
                  hidden={user ? false : true}
                  to="/order"
                >
                  Order
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </React.Fragment>
  );
};

export default Navigation;
