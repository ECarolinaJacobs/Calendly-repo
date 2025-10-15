// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
// import EventPage from "./events/EventPage";
import "./App.css"
import { LoginCredentials } from "./Login";

function App() {
  return (
      <Routes>
        {/* <Route path="/events/:event" element={<EventPage />} /> */}
        <Route path="/" element={<LoginCredentials />} />
      </Routes>
  );
}

export default App;