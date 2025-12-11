import React from "react";
import type { EventInfoProps } from "./types";

export const EventInfo: React.FC<EventInfoProps> = ({ title, description }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold text-gray-900 leading-tight">
        {title}
      </h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};
