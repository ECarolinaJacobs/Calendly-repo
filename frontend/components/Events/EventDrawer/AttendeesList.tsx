import React from "react";
import { Users } from "lucide-react";
import type { AttendeesListProps, Attendee } from "./types";
import { AttendeeAvatar } from "./AttendeeAvatar";

export const AttendeesList: React.FC<AttendeesListProps> = ({ attendees }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {attendees.length} Deelnemers
        </h3>
      </div>

      {/* Desktop: Avatars only */}
      <div className="hidden sm:flex flex-wrap gap-3">
        {attendees.map((attendee: Attendee, index: number) => (
          <AttendeeAvatar key={index} attendee={attendee} index={index} />
        ))}
      </div>

      {/* Mobile: Grid with names */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {attendees.map((attendee: Attendee, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {attendee.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
