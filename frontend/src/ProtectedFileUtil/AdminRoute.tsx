//elena
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const isAuthenticated = token !== null;
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (!isAdmin) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}
export default AdminRoute;