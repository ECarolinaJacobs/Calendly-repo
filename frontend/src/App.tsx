// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import "./Login.css"
import { LoginCredentials } from "./Login";
import { RegisterPage } from "./Register";
import EventPage from "./pages/EventPage";
import "./App.css"

function App() {
  return (
      <Routes>
        {/* <Route path="/events/:event" element={<EventPage />} /> */}
        <Route path="/login" element={<LoginCredentials />} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/events/:event" element={<EventPage />} />
      </Routes>
  );
}

export default App;