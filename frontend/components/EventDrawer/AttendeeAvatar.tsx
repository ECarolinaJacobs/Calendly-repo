import React from "react";
import type { AttendeeAvatarProps } from "./types";

export const AttendeeAvatar: React.FC<AttendeeAvatarProps> = ({
  attendee,
  index,
}) => {
  return (
    <div key={index} className="group relative">
      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md transform group-hover:scale-110 transition-transform duration-200">
        <img
          src={attendee.avatar}
          alt={attendee.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {attendee.name}
      </div>
    </div>
  );
};
