import type { Review } from "../../../src/models/Review";


export interface Attendee {
  id: number;
  employeeId: number;
  eventId: number
  name: string;
  avatar?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  attendees?: Attendee[];
  reviews?: Review[];
}

export interface CreateEventRequest {
	Title: string;
	Description: string;
	Image?: string;
	StartDate?: string;
	EndDate?: string;
}

export interface DrawerHeaderProps {
  onClose: () => void;
  onCopyUrl: () => void;
  copied: boolean;
}

export interface EventImageProps {
  src: string;
  alt: string;
}

export interface EventInfoProps {
  title: string;
  description: string;
}

export interface EventDatesProps {
  startDate: string;
  endDate: string;
}

export interface AttendeeAvatarProps {
  attendee: Attendee;
  index: number;
}

export interface AttendeesListProps {
  attendees: Attendee[];
}

export interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DrawerContentProps {
  isOpen: boolean;
  event: Event;
  copied: boolean;
  onClose: () => void;
  onCopyUrl: () => void;
}

export interface JoinButtonProps {
  callToAction: string;
}