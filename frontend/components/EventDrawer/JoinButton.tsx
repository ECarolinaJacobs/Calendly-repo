import React from "react";
import type { JoinButtonProps } from "./types";

export const JoinButton: React.FC<JoinButtonProps> = ({ callToAction }) => {
  return (
    <button className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
      {callToAction}
    </button>
  );
};
