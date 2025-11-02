// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import { LoginCredentials } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import "./App.css"
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
      <Routes>
        {/* <Route path="/events/:event" element={<EventPage />} /> */}
        <Route path="/login" element={<LoginCredentials />} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/events/:event" element={<EventPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
  );
}

export default App;