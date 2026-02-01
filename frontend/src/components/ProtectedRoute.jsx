import { Navigate } from "react-router-dom";

export const ProtectedRoute = async ({ child }) => {
  const token = localStorage.getItem("tasklane_token");
  if (!token) return <Navigate to="/login" />;
  return child;
};
