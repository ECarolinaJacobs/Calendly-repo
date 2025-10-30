import React from "react";
import type { DrawerContentProps } from "./types";
import { DrawerHeader } from "./DrawerHeader";
import { EventImage } from "./EventImage";
import { EventInfo } from "./EventInfo";
import { EventDates } from "./EventDates";
import { AttendeesList } from "./AttendeesList";
import { JoinButton } from "./JoinButton";

export const DrawerContent: React.FC<DrawerContentProps> = ({
  isOpen,
  event,
  copied,
  onClose,
  onCopyUrl,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto">
        <DrawerHeader onClose={onClose} onCopyUrl={onCopyUrl} copied={copied} />

        <div className="p-6 space-y-6">
          <EventImage src={event.image} alt={event.title} />
          <EventInfo title={event.title} description={event.description} />
          <EventDates startDate={event.startDate} endDate={event.endDate} />
          <AttendeesList attendees={event.attendees} />
          <JoinButton callToAction="Doe Mee aan Evenement" />
        </div>
      </div>
    </div>
  );
};
