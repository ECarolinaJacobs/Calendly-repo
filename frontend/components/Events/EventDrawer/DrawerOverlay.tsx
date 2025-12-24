import React from "react";
import type { DrawerOverlayProps } from "./types";

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
      onClick={onClose}
    />
  );
};
