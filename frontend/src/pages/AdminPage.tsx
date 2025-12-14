import { useEffect, useState } from "react";
import {
	getAllEmployees,
	deleteEmployee,
	searchEmployees,
	getStatistics,
} from "../api/admin";
import "./AdminPage.css";
import type { AdminStats } from "../api/admin";
import { AdminCreateEvent } from "../../components/Events/form-creation";

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

    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [employeesData, statsData] = await Promise.all([
                getAllEmployees(),
                getStatistics(),
            ]);
            setEmployees(employeesData || []);
            setStats(statsData);
        } catch (err) {
            setError("Failed to load data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
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


    if (loading && !stats) {
        return <div className="loading">Loading...</div>;
    }
    if (error && !stats) {
        return <div className="error">{error}</div>;
    }
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            {error && (
                <div className="error" role="alert" aria-live="polite">
                    {error}
                </div>
            )}
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
            {/*event creation section */}
            <AdminCreateEvent />
            {/*search bar */}
            <div className="search-container" role="search" aria-label="Search employees">
                <input
                    type="text"
                    placeholder="Search employee by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="search-input"
                    aria-label="Search input for employee name or email"
                />
                <button onClick={handleSearch} className="search-btn" aria-label="Search for employees">
                    Search
                </button>
                {searchTerm && (
                    <button onClick={handleClearSearch} className="clear-btn" aria-label="Clear search and show all employees">
                        Clear
                    </button>
                )}
            </div>
            { /*employee table*/}
            <h2>Employees ({employees.length})</h2>
            <table className="employee-table" aria-label="Employee list">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Admin</th>
                        <th scope="col">Coins</th>
                        <th scope="col">Actions</th>
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
                                        className="delete-btn" aria-label={`Delete employee ${employee.name}`}
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
