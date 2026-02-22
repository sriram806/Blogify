"use client";

import { FaUserCircle } from "react-icons/fa";

type Props = {
  name?: string;
};

export default function Loading({ name }: Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">

        {/* Avatar */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <FaUserCircle className="text-4xl text-gray-400" />
        </div>

        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-900">
          {name}
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-sm mt-1">
          Loading your profile
        </p>

        {/* Subtle loading line */}
        <div className="mt-6 h-2 w-full bg-gray-200 rounded overflow-hidden">
          <div className="h-full w-1/3 bg-gray-400 animate-pulse" />
        </div>

      </div>
    </div>
  );
}