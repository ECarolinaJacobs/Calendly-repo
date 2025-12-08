import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Event } from "../../components/EventDrawer/types";
import { DrawerOverlay } from "../../components/EventDrawer/DrawerOverlay";
import { DrawerContent } from "../../components/EventDrawer/DrawerContent";

export default function EventDrawer() {
  const { event } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [eventData, setEventData] = useState<Event | null>(null);
  console.log("Event ID from URL:", event);

  useEffect(() => {
    if (!event) return;
    fetch(`http://localhost:5167/api/event/${event}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched event data:", data);
        setEventData(data);
      })
      .catch((err) => console.error(err));
  }, [event]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleCloseDrawer = () => setIsOpen(false);
  const handleOpenDrawer = () => setIsOpen(true);
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <button
        onClick={handleOpenDrawer}
        className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Bekijk Evenement Details
      </button>

      <DrawerOverlay isOpen={isOpen} onClose={handleCloseDrawer} />

      {eventData && (
        <DrawerContent
          isOpen={isOpen}
          event={eventData}
          copied={copied}
          onClose={handleCloseDrawer}
          onCopyUrl={handleCopyUrl}
        />
      )}
    </div>
  );
}
