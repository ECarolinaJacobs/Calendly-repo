import { useEffect, useState } from "react";
import {
	getAllEmployees,
	deleteEmployee,
	searchEmployees,
	getStatistics,
} from "../api/admin";
import { getEvents, deleteEvent, updateEvent } from "../api/eventService";
import "../css/AdminPage.css";
import type { AdminStats } from "../api/admin";
import type { Event, CreateEventRequest } from "../models/Event";
import { AdminCreateEvent } from "../../components/Events/form-creation";

interface Employee {
	id: number;
	name: string;
	email: string;
	isAdmin: boolean;
	coins: number;
}

export default function AdminPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [events, setEvents] = useState<Event[]>([]);
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [editForm, setEditForm] = useState<CreateEventRequest>({
		title: "",
		description: "",
		image: "",
		startDate: undefined,
		endDate: undefined,
		attendees: [],
	});

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [employeesData, statsData, eventsData] = await Promise.all([
				getAllEmployees(),
				getStatistics(),
				getEvents(),
			]);
			setEmployees(employeesData || []);
			setStats(statsData);
			setEvents(eventsData || []);
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
		loadData();
	};

	const handleDelete = async (id: number, name: string) => {
		if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
			return;
		}
		try {
			const success = await deleteEmployee(id);
			if (success) {
				loadData();
				alert("Employee deleted successfully");
			} else {
				alert("Failed to delete employee");
			}
		} catch (err) {
			console.error(err);
			alert("Error deleting employee");
		}
	};

	const handleDeleteEvent = async (id: number, title: string) => {
		if (
			!window.confirm(`Are you sure you want to delete event "${title}"?`)
		) {
			return;
		}
		try {
			const success = await deleteEvent(id);
			if (success) {
				loadData();
				alert("Event deleted successfully");
			} else {
				alert("Failed to delete event");
			}
		} catch (err) {
			console.error(err);
			alert("Error deleting event");
		}
	};

	const handleEditEvent = (event: Event) => {
		setEditingEvent(event);
		setEditForm({
			title: event.title,
			description: event.description,
			image: event.image || "",
			startDate: event.startDate,
			endDate: event.endDate,
			attendees: event.attendees || [],
		});
	};

	const handleCancelEdit = () => {
		setEditingEvent(null);
		setEditForm({
			title: "",
			description: "",
			image: "",
			startDate: undefined,
			endDate: undefined,
			attendees: [],
		});
	};

	const handleUpdateEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingEvent) return;

		try {
			await updateEvent(editingEvent.id, editForm);
			alert("Event updated successfully");
			handleCancelEdit();
			loadData();
		} catch (err) {
			console.error(err);
			alert("Error updating event");
		}
	};

	const formatDate = (date: string | Date | undefined) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString();
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
						<p className="stat-number">
							{stats.averageCoinsPerUser.toFixed(1)}
						</p>
					</div>
				</div>
			)}

			<AdminCreateEvent />

			{/* Events Management Section */}
			<div className="events-section">
				<h2>Events Management ({events.length})</h2>

				{editingEvent && (
					<div className="edit-event-modal">
						<div className="modal-content">
							<h3>Edit Event</h3>
							<form
								onSubmit={handleUpdateEvent}
								className="edit-event-form"
							>
								<div className="form-group">
									<label htmlFor="edit-title">Title:</label>
									<input
										type="text"
										id="edit-title"
										value={editForm.title}
										onChange={(e) =>
											setEditForm({
												...editForm,
												title: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="edit-description">
										Description:
									</label>
									<textarea
										id="edit-description"
										value={editForm.description}
										onChange={(e) =>
											setEditForm({
												...editForm,
												description: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="edit-image">
										Image URL:
									</label>
									<input
										type="text"
										id="edit-image"
										value={editForm.image}
										onChange={(e) =>
											setEditForm({
												...editForm,
												image: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="edit-start-date">
										Start Date:
									</label>
									<input
										type="datetime-local"
										id="edit-start-date"
										value={
											editForm.startDate
												? new Date(editForm.startDate)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setEditForm({
												...editForm,
												startDate: e.target.value
													? new Date(e.target.value)
													: undefined,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="edit-end-date">
										End Date:
									</label>
									<input
										type="datetime-local"
										id="edit-end-date"
										value={
											editForm.endDate
												? new Date(editForm.endDate)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setEditForm({
												...editForm,
												endDate: e.target.value
													? new Date(e.target.value)
													: undefined,
											})
										}
									/>
								</div>
								<div className="form-actions">
									<button type="submit" className="save-btn">
										Save Changes
									</button>
									<button
										type="button"
										onClick={handleCancelEdit}
										className="cancel-btn"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				<table className="events-table" aria-label="Events list">
					<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">Title</th>
							<th scope="col">Description</th>
							<th scope="col">Start Date</th>
							<th scope="col">End Date</th>
							<th scope="col">Attendees</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{events.length === 0 ? (
							<tr>
								<td colSpan={7} style={{ textAlign: "center" }}>
									No events found
								</td>
							</tr>
						) : (
							events.map((event) => (
								<tr key={event.id}>
									<td>{event.id}</td>
									<td>{event.title}</td>
									<td>{event.description}</td>
									<td>{formatDate(event.startDate)}</td>
									<td>{formatDate(event.endDate)}</td>
									<td>{event.attendees?.length || 0}</td>
									<td>
										<button
											onClick={() =>
												handleEditEvent(event)
											}
											className="edit-btn"
											aria-label={`Edit event ${event.title}`}
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDeleteEvent(
													event.id,
													event.title,
												)
											}
											className="delete-btn"
											aria-label={`Delete event ${event.title}`}
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
				>
					Search
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
							<td colSpan={6} style={{ textAlign: "center" }}>
								{searchTerm
									? "No employees found"
									: "No employees"}
							</td>
						</tr>
					) : (
						employees.map((employee) => (
							<tr key={employee.id}>
								<td>{employee.id}</td>
								<td>{employee.name}</td>
								<td>{employee.email}</td>
								<td>{employee.isAdmin ? "Yes" : "No"}</td>
								<td>{employee.coins}</td>
								<td>
									<button
										onClick={() =>
											handleDelete(
												employee.id,
												employee.name,
											)
										}
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
