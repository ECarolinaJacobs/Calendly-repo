import "./NotFound.css" 
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export default function NotFound()
{      
    const location = useLocation(); 
    const { pathname} = location;
    const navigate = useNavigate();
    return(
      <div className="dashboard-redirect-container">
        <div className="not-found-title">404</div>
        <p>The page with this path was not found: {pathname}</p>
        <p>Please return to the dashboard page <button onClick={() => navigate("/dashboard")}> <img src="dist/white_arrow.png" alt="white-arrow"></img></button></p>
      </div>
    )
}