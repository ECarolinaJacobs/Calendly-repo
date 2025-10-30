import { Outlet, Navigate } from "react-router-dom";
// Outlet allows to render child routes

// This component checks if the user is authenticated to acces protected routes
const ProtectedRoutes = () => {

    //Gets the sessiontoken from the session storage
    const token = sessionStorage.getItem("Token");
    const isAuthenticated = token!==null;
    return isAuthenticated? <Outlet/> : <Navigate to= "/login"/>;  //If user is authenticated let them acces the child routes, else redirect to the login page.
                                                        //^ place holder to redirect if the user is not authenticated

}

export default ProtectedRoutes;