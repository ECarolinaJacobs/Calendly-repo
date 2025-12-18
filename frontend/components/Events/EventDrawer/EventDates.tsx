import React from "react";
import { Calendar } from "lucide-react";
import type { EventDatesProps } from "./types";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const EventDates: React.FC<EventDatesProps> = ({
  startDate,
  endDate,
}) => {
  return (
    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">
            Evenement Data
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};
