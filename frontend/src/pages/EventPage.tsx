import { useState } from "react";
import type { Event } from "../../components/EventDrawer/types";
import { DrawerOverlay } from "../../components/EventDrawer/DrawerOverlay";
import { DrawerContent } from "../../components/EventDrawer/DrawerContent";

export default function EventDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const event: Event = {
    title: "Zomer Muziekfestival 2025",
    description:
      "Sluit je aan bij ons voor een onvergetelijke avond vol live muziek, eten en entertainment onder de sterren. Met topkunstenaars en lokale talenten.",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
    startDate: "2025-07-15",
    endDate: "2025-07-17",
    attendees: [
      { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=13" },
      { name: "Emily Rodriguez", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "David Kim", avatar: "https://i.pravatar.cc/150?img=12" },
      { name: "Lisa Anderson", avatar: "https://i.pravatar.cc/150?img=9" },
      { name: "Alex Turner", avatar: "https://i.pravatar.cc/150?img=8" },
      { name: "Sammy Redelijkheid", avatar: "https://i.pravatar.cc/150?img=7" },
    ],
  };

  const handleCopyUrl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopiëren mislukt:", err);
    }
  };

  const handleCloseDrawer = (): void => {
    setIsOpen(false);
  };

  const handleOpenDrawer = (): void => {
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <button
        onClick={handleOpenDrawer}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Bekijk Evenement Details
      </button>

      <DrawerOverlay isOpen={isOpen} onClose={handleCloseDrawer} />

      <DrawerContent
        isOpen={isOpen}
        event={event}
        copied={copied}
        onClose={handleCloseDrawer}
        onCopyUrl={handleCopyUrl}
      />
    </div>
  );
}
