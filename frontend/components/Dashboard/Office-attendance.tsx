import type { OfficeAttendanceProps } from "../../src/types/dashboard.types";


export function OfficeAttendance({ attendances, setShowAttendanceModal, openEditModal, handleDeleteAttendance }: OfficeAttendanceProps) {
  return (
    <section className="events-box">
      <div className="attendance-header">
        <h3>Office Attendance</h3>
        <button
          onClick={() => setShowAttendanceModal(true)}
          className="attendance-book-button"
        >
          + Book
        </button>
      </div>
      <div className="attendance-list">
        {attendances.length === 0 ? (
          <p className="attendance-empty">
            No attendance booked yet
          </p>
        ) : (
          attendances.map(att => (
            <div
              key={att.id}
              className="attendance-item"
            >
              <span className="attendance-date">
                {new Date(att.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <div className="attendance-actions">
                <button
                  onClick={() => openEditModal(att)}
                  className="attendance-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAttendance(att.id)}
                  className="attendance-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
