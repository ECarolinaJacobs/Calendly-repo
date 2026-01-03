//elena
import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	role: string
}

/**
 * protected route component that only allows admins
 * @returns outlet for nested routed if authorized, otherwise login page
 */
const AdminRoute = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    const decodedJwt = jwtDecode<JwtPayload>(token);
    const isAdmin = decodedJwt.role === "Admin";
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
export default AdminRoute;