// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import EventPage from "./events/EventPage";
import "./App.css"
import ProtectedRoutes from "./ProtectedFileUtil/ProtectedPages.tsx";

function App() {
  return (
      <Routes>
        //Routes that do not need authentication can go here for example the login and sign in routes


        // Only logged in users can acces the routes below.
        // Routes that need authentication need to go inside the ProtectedRoutes component
        <Route element={<ProtectedRoutes/>}>
          <Route path="/events/:event" element={<EventPage />} />
          
        </Route>
      </Routes>
  );
}

export default App;