// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/EventPage";
import "./App.css"
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
      <Routes>
        <Route path="/events/:event" element={<EventPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
      </Routes>
  );
}

export default App;