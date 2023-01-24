import React from "react";
import { Navigate } from "react-router";

const PublicRoute = ({ user, redirectPath = "/", children }) => {
  if (user) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default PublicRoute;
