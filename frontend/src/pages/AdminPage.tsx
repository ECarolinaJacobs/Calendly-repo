import { useEffect, useState } from 'react';
import { getAllEmployees, deleteEmployee } from '../api/admin';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // get auth token 
    const token = localStorage.getItem('authToken') || '';
    // get employees when component loads
    useEffect(() => {
        loadEmployees();
    }, []);
    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllEmployees(token);
            setEmployees(data || []);
        } catch (err) {
            setError('Failed to load employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }
        try {
            const success = await deleteEmployee(id, token);
            if (success) {
                //remove from local state (optimistic update)
                setEmployees(employees.filter(emp => emp.id !== id));
                alert('Employee deleted successfully');
            } else {
                alert('Failed to delete employee');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting employee');
        }
    };
    if (loading) {
        return <div className="loading">Loading employees...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Total Employees: {employees.length}</p>
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
                    {employees.map(employee => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
