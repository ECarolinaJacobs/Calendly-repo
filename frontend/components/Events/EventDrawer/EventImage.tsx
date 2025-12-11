import React from "react";
import type { EventImageProps } from "./types";

export const EventImage: React.FC<EventImageProps> = ({ src, alt }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
      <img
        src={src}
        alt={alt}
        className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
};
