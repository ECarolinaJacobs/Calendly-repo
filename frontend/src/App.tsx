// App.jsx (or your main routing file)
import { Routes, Route } from "react-router-dom";
import { LoginCredentials } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import EventPage from "./pages/EventPage";
import BookingPage from "../src/pages/BookingPage.tsx";
import "./App.css"
import ProtectedRoutes from "./ProtectedFileUtil/ProtectedPages.tsx";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage.tsx";
import AdminRoute from "./ProtectedFileUtil/AdminRoute.tsx";
import MyEventsPage from "./pages/MyEventsPage";

function App() {
  return (
    <Routes>
      {/*Routes that do not need authentication can go here for example the login and sign in routes
        Only logged in users can acces the routes below.
        Routes that need authentication need to go inside the ProtectedRoutes component*/}

      <Route element={<ProtectedRoutes />}>
        <Route path="/events/:event" element={<EventPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
      </Route>
      {/*Admin route*/}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
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
