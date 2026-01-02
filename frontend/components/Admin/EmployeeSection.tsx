import { useState } from 'react';
import { searchEmployees, deleteEmployee } from '../../src/api/admin';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmationHook';
import type { Employee } from '../../hooks/useAdminDataHook';
import toast from "react-hot-toast";

interface EmployeeSectionProps {
    employees: Employee[];
    setEmployees: (employees: Employee[]) => void;
    onDataChange: () => void;
}

/**
 * elena
 * employee section component
 * manages employee list display, search functionality and delete
 */

export function EmployeeSection({ employees, setEmployees, onDataChange }: EmployeeSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const { handleDelete } = useDeleteConfirmation(
        deleteEmployee,
        onDataChange,
        "Employee"
    );
    /**
     * performs employee search by name of filter
     * handles empty search term by reloading all data
     */
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            onDataChange();
            return;
        }
        setIsSearching(true);
        try {
            const results = await searchEmployees(searchTerm);
            setEmployees(results || []);
        } catch (err) {
            toast.error("Search failed");
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };
    /**
     * clears search term and reloads all emps
     */
    const handleClearSearch = () => {
        setSearchTerm("");
        onDataChange();
    };
    return (
        <div>
            <div
                className="search-container"
                role="search"
                aria-label="Search employees"
            >
                <input
                    type="text"
                    placeholder="Search employee by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="search-input"
                    aria-label="Search input for employee name or email"
                />
                <button
                    onClick={handleSearch}
                    className="search-btn"
                    aria-label="Search for employees"
                    disabled={isSearching}
                >
                    {isSearching ? "Searching..." : "Search"}
                </button>
                {searchTerm && (
                    <button
                        onClick={handleClearSearch}
                        className="clear-btn"
                        aria-label="Clear search and show all employees"
                    >
                        Clear
                    </button>
                )}
            </div>
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
                            <td colSpan={6} className="center-text">
                                {searchTerm ? "No employees found" : "No employees"}
                            </td>
                        </tr>
                    ) : (
                        employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.isAdmin ? "Yes" : "No"}</td>
                                <td>{employee.coins}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(employee.id, employee.name)}
                                        className="delete-btn"
                                        aria-label={`Delete employee ${employee.name}`}
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
