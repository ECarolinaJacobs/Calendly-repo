import {
    IoHomeOutline,
    IoBusinessOutline,
    IoCalendarClearOutline,
    IoMenu,
    IoClose,
    IoPersonOutline,
    IoBookmarksOutline,
} from "react-icons/io5";
import type {SidebarProps} from "../../src/types/dashboard.types";


export function Sidebar({ sidebarOpen, setSidebarOpen, activeItem, setActiveItem, navigate }: SidebarProps) {
    return (
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <IoClose /> : <IoMenu />}
            </button>
            <ul className="sidebar-menu">
                <li
                    className={`sidebar-item ${activeItem === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveItem("dashboard")}
                >
                    <span className="icon">
                        <IoHomeOutline />
                    </span>
                    {sidebarOpen && <span className="label">Dashboard</span>}
                </li>
                <li
                    className={`sidebar-item ${activeItem === "rooms" ? "active" : ""}`}
                    onClick={() => {
                        setActiveItem("rooms");
                        navigate("/booking");
                    }}
                >
                    <span className="icon"><IoBusinessOutline /></span>
                    {sidebarOpen && <span className="label">Rooms</span>}
                </li>
                <li
                    className={`sidebar-item ${activeItem === "my-bookings" ? "active" : ""}`}
                    onClick={() => {
                        setActiveItem("my-bookings");
                        navigate("/my-bookings");
                    }}
                >
                    <span className="icon">
                        <IoBookmarksOutline />
                    </span>
                    {sidebarOpen && <span className="label">My Bookings</span>}
                </li>
                <li
                    className={`sidebar-item ${activeItem === "events" ? "active" : ""}`}
                    onClick={() => {
                        setActiveItem("events");
                        navigate("/events/:event");
                    }}
                >
                    <span className="icon">
                        <IoCalendarClearOutline />
                    </span>
                    {sidebarOpen && <span className="label">Events</span>}
                </li>
                <li
                    className={`sidebar-item ${activeItem === "profile" ? "active" : ""}`}
                    onClick={() => {
                        setActiveItem("profile");
                        navigate("/profile");
                    }}
                >
                    <span className="icon"><IoPersonOutline /></span>
                    {sidebarOpen && <span className="label">Profile</span>}
                </li>
            </ul>
        </aside>
    )
}
