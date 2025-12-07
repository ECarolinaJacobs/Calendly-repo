// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import { LoginCredentials } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import "./App.css";
import ProtectedRoutes from "./ProtectedFileUtil/ProtectedPages.tsx";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
    <Routes>
      {/*Routes that do not need authentication can go here for example the login and sign in routes
        Only logged in users can acces the routes below.
        Routes that need authentication need to go inside the ProtectedRoutes component*/}
      <Route element={<ProtectedRoutes />}>
        <Route path="/events/:event" element={<EventPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} /> //FIXME: admin can be accesed through url by logged in normal user, assignee: Elena
      </Route>
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/login" element={<LoginCredentials />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LoginCredentials />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
