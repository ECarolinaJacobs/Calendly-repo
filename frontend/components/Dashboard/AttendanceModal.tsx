import type { AttendanceModalProps } from "../../src/types/dashboard.types";

export function AttendanceModal({ editingAttendance, newAttendanceDate, setNewAttendanceDate, handleUpdateAttendance, handleAddAttendance, closeAttendanceModal }: AttendanceModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{editingAttendance ? 'Update' : 'Book'} Office Attendance</h3>
                <input
                    type="date"
                    value={newAttendanceDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewAttendanceDate(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={editingAttendance ? handleUpdateAttendance : handleAddAttendance}>
                        {editingAttendance ? 'Update' : 'Book'}
                    </button>
                    <button onClick={closeAttendanceModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
