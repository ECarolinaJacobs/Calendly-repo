import { Toaster } from 'react-hot-toast';
import { useAdminData } from '../../hooks/useAdminDataHook';
import { StatsCards } from '../../components/Admin/StatsCards';
import { EmployeeSection } from '../../components/Admin/EmployeeSection';
import { EventsSection } from '../../components/Admin/EventSection';
import { ReviewsSection } from '../../components/Admin/ReviewSection';
import { AdminCreateEvent } from '../../components/Events/form-creation';
import '../css/AdminPageCss/AdminPage.css';
import '../css/AdminPageCss/EventsSection.css';
import '../css/AdminPageCss/ReviewSection.css';

/** 
 * main dashboard for admin users to manage all aspects of the application
 * provied interfaces for:
 * - viewing stats, managing employees, managing events, managing reviews
 * @returns JSX.Element the complete admin dashboard interface
 */
export default function AdminPage() {
	const {
		employees,
		setEmployees,
		events,
		reviews,
		stats,
		loading,
		error,
		loadData,
	} = useAdminData();
	if (loading && !stats) {
		return <div className="loading">Loading...</div>;
	}
	if (error && !stats) {
		return <div className="error">{error}</div>;
	}
	return (
		<>
			{/*toats notificatin container */}
			<Toaster position="top-right" />
			<main className="admin-page">
				<h1>Admin Dashboard</h1>
				{
					error && (
						<div className="error" role="alert" aria-live="polite">
							{error}
						</div>
					)}
				{stats && <StatsCards stats={stats} />}
				<AdminCreateEvent />
				<ReviewsSection
					reviews={reviews}
					events={events}
					onDataChange={loadData}
				/>
				<EventsSection
					events={events}
					onDataChange={loadData}
				/>
				<EmployeeSection
					employees={employees}
					setEmployees={setEmployees}
					onDataChange={loadData}
				/>
			</main>
		</>
	);
}


