// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
// import EventPage from "./events/EventPage";
import "./Login.css"
import { LoginCredentials } from "./Login";
import { RegisterPage } from "./Register";

function App() {
  return (
      <Routes>
        {/* <Route path="/events/:event" element={<EventPage />} /> */}
        <Route path="/login" element={<LoginCredentials />} />
        <Route path="/register" element={<RegisterPage />}/>
      </Routes>
  );
}

export default App;