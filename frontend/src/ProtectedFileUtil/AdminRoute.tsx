//elena
import { Outlet, Navigate } from "react-router-dom";

/**
 * protected route component that only allows admins
 * @returns outlet for nested routed if authorized, otherwise login page
 */
const AdminRoute = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!token || !isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
export default AdminRoute;