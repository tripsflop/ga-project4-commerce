import React from "react";
import { Navigate } from "react-router";
import Role from "../helper/roles.js";

const ProtectedRoute = ({ user, role, redirectPath = "/admin", children }) => {
  if (!user && role != Role.Admin) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
