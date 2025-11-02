// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import "./App.css"

function App() {
  return (
      <Routes>
        <Route path="/events/:event" element={<EventPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
  );
}

export default App;