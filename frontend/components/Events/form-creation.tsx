import { useState } from "react";
import { CustomDatePicker } from "../utils/custom-date-picker";
import { EventService } from "../../src/api/Services/eventService";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export const AdminCreateEvent: React.FC = () => {
	const [eventForm, setEventForm] = useState({
		title: "",
		description: "",
		image: "",
		startDate: "",
		endDate: "",
	});

	const handleCreateEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await EventService.createEvent({
				Title: eventForm.title,
				Description: eventForm.description,
				Image: eventForm.image,
				StartDate: eventForm.startDate,
				EndDate: eventForm.endDate,
			});
			toast.success("Event created successfully!");
			setEventForm({
				title: "",
				description: "",
				image: "",
				startDate: "",
				endDate: "",
			});
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};
	return (
		<>
			<Toaster />

			<div className="event-creation-section bg-white p-8 rounded-lg shadow-md mb-8">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					Create New Event
				</h2>
				<form className="grid gap-6" onSubmit={handleCreateEvent}>
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							value={eventForm.title}
							onChange={(e) =>
								setEventForm({
									...eventForm,
									title: e.target.value,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Description
						</label>
						<textarea
							id="description"
							value={eventForm.description}
							onChange={(e) =>
								setEventForm({
									...eventForm,
									description: e.target.value,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="image"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Image URL
						</label>
						<input
							type="text"
							id="image"
							value={eventForm.image}
							onChange={(e) =>
								setEventForm({
									...eventForm,
									image: e.target.value,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
						/>
					</div>
					<div>
						<CustomDatePicker
							label="Start Date"
							placeholder="Select start date"
							selected={
								eventForm.startDate
									? new Date(eventForm.startDate)
									: null
							}
							onChange={(e) =>
								setEventForm({
									...eventForm,
									startDate: e ? e.toISOString() : "",
								})
							}
						/>
						<CustomDatePicker
							label="End Date"
							placeholder="Select end date"
							selected={
								eventForm.endDate
									? new Date(eventForm.endDate)
									: null
							}
							onChange={(e) =>
								setEventForm({
									...eventForm,
									endDate: e ? e.toISOString() : "",
								})
							}
						/>
					</div>

					<button
						type="submit"
						className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
					>
						Create Event
					</button>
				</form>
			</div>
		</>
	);
};
