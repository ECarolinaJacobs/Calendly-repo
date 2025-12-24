import React from "react";
import { X, Copy, Check } from "lucide-react";
import type { DrawerHeaderProps } from "./types";

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  onClose,
  onCopyUrl,
  copied,
}) => {
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Sluit drawer"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={onCopyUrl}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-medium text-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Gekopieerd!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Kopieer Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
