import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    // Check for the auth token in localStorage
    const token = localStorage.getItem("token");
    const isAuthenticated = token !== null;

    // If authenticated, render the child routes (Outlet). Otherwise, redirect to the login page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;