import type { AddEventModalProps } from "../../src/types/dashboard.types";

export function AddEventModal({ selectedDate, newEventTitle, setNewEventTitle, newEventTime, setNewEventTime, handleAddEvent, setShowAddEventModal }: AddEventModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Add item for {selectedDate.toLocaleDateString()}</h3>
                <input
                    type="text"
                    placeholder="Item title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                />
                <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleAddEvent}>Add</button>
                    <button onClick={() => setShowAddEventModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}