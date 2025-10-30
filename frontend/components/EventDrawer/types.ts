export interface Attendee {
  name: string;
  avatar: string;
}

export interface Event {
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  attendees: Attendee[];
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