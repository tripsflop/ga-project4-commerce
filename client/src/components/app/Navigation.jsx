import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Navigation = () => {
  const style = ({ isActive }) => ({
    paddingLeft: "10px",
    paddingRight: "10px",
    fontWeight: isActive ? "bold" : "normal",
  });

  const quantity = useSelector((state) => state.cart.quantity);

  return (
    <React.Fragment>
      <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        <NavLink style={style} to="/">
          Home
        </NavLink>
        <NavLink style={style} to="/explore">
          Explore
        </NavLink>
        <NavLink style={style} to="/account">
          Account
        </NavLink>
        <NavLink style={style} to="/profile">
          Profile
        </NavLink>
        <NavLink style={style} to="/cart">
          {`Cart(${quantity})`}
        </NavLink>
      </nav>
      <main style={{ padding: "1rem 0" }}>
        <Outlet />
      </main>
    </React.Fragment>
  );
};

export default Navigation;
