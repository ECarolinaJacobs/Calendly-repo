import { useEffect, useState } from 'react';
<<<<<<< ours
import { getAllEmployees, deleteEmployee, searchEmployees, getStatistics } from '../api/admin';
import { createEvent } from '../api/eventService';
import type { AdminStats } from '../api/admin';
import "./AdminPage.css";

||||||| ancestor
import { getAllEmployees, deleteEmployee } from '../api/admin';
=======
import { getAllEmployees, deleteEmployee, searchEmployees, getStatistics } from '../api/admin';
import type { AdminStats } from '../api/admin';
import "./AdminPage.css";

>>>>>>> theirs
// typescript interface to match employeeDto
interface Employee {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    coins: number;
}

export default function AdminPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    // fetch data when component loads
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            //load employees and statistics
            const [employeesData, statsData] = await Promise.all([
                getAllEmployees(),
                getStatistics()
            ]);
            setEmployees(employeesData || []);
            setStats(statsData)
        } catch (err) {
            setError("Failed to load data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            // if search is empty reload all employees
            loadData();
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const results = await searchEmployees(searchTerm);
            setEmployees(results || []);
        } catch (err) {
            setError("Search failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleClearSearch = () => {
        setSearchTerm("");
        loadData(); //reload all employees
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }
        try {
            const success = await deleteEmployee(id);
            if (success) {
                //reload data after deleting
                loadData();
                alert("Employee deleted successfully");
            } else {
                alert("Failed to delete employee");
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting employee');
        }
    };
<<<<<<< ours
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        image: '',
        startDate: '',
        endDate: ''
    });

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEvent({
                Title: eventForm.title,
                Description: eventForm.description,
                Image: eventForm.image,
                StartDate: eventForm.startDate ? new Date(eventForm.startDate).toISOString() : undefined,
                EndDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : undefined
            });
            alert("Event created successfully!");
            setEventForm({ title: '', description: '', image: '', startDate: '', endDate: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    };

    if (loading && !stats) {
        return <div className="loading">Loading...</div>;
||||||| ancestor
    if (loading) {
        return <div className="loading">Loading employees...</div>;
=======
    if (loading && !stats) {
        return <div className="loading">Loading...</div>;
>>>>>>> theirs
    }
    if (error && !stats) {
        return <div className="error">{error}</div>;
    }
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
<<<<<<< ours
            {/*statistics cards*/}
            {stats && (
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Employees</h3>
                        <p className="stat-number">{stats.totalEmployees}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Admins</h3>
                        <p className="stat-number">{stats.totalAdmins}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Regular users</h3>
                        <p className="stat-number">{stats.totalRegularUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total coins</h3>
                        <p className="stat-number">{stats.totalCoins}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Average Coins per user</h3>
                        <p className="stat-number">{stats.averageCoinsPerUser.toFixed(1)}</p>
                    </div>
                </div>
            )}

            {/* Event Creation Section */}
            <div className="event-creation-section" style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Create New Event</h2>
                <form onSubmit={handleCreateEvent} style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={eventForm.title}
                            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={eventForm.description}
                            onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label>Image URL:</label>
                        <input
                            type="text"
                            value={eventForm.image}
                            onChange={e => setEventForm({ ...eventForm, image: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <input
                            type="datetime-local"
                            value={eventForm.startDate}
                            onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label>End Date:</label>
                        <input
                            type="datetime-local"
                            value={eventForm.endDate}
                            onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Create Event
                    </button>
                </form>
            </div>

            {/*search bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search employee by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">
                    Search
                </button>
                {searchTerm && (
                    <button onClick={handleClearSearch} className="clear-btn">
                        Clear
                    </button>
                )}
            </div>
            { /*employee table*/}
            <h2>Employees ({employees.length})</h2>
||||||| ancestor
            <p>Total Employees: {employees.length}</p>
=======
            {/*statistics cards*/}
            {stats && (
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Employees</h3>
                        <p className="stat-number">{stats.totalEmployees}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Admins</h3>
                        <p className="stat-number">{stats.totalAdmins}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Regular users</h3>
                        <p className="stat-number">{stats.totalRegularUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total coins</h3>
                        <p className="stat-number">{stats.totalCoins}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Average Coins per user</h3>
                        <p className="stat-number">{stats.averageCoinsPerUser.toFixed(1)}</p>
                    </div>
                </div>
            )}
            {/*search bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search employee by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">
                    Search
                </button>
                {searchTerm && (
                    <button onClick={handleClearSearch} className="clear-btn">
                        Clear
                    </button>
                )}
            </div>
            { /*employee table*/}
            <h2>Employees ({employees.length})</h2>
>>>>>>> theirs
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Coins</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                {searchTerm ? "No employees found" : "No employees"}
                            </td>
                        </tr>
                    ) : (
                        employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.isAdmin ? "Yes" : "No"}</td>
                                <td>{employee.coins}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(employee.id, employee.name)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
