"use client";

type Props = {
  name?: string;
};

export default function Loading({ name }: Props) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 w-full">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-gray-100 flex flex-col items-center animate-pulse">

        {/* Avatar Skeleton */}
        <div className="w-24 h-24 rounded-full bg-linear-to-tr from-gray-200 to-gray-300 mb-6 shadow-xs" />

        {/* Title / Name Skeleton */}
        <div className="w-3/4 sm:w-1/2 h-6 bg-gray-200 rounded-lg mb-4" />

        {/* Subtext Skeleton */}
        <div className="w-1/2 sm:w-1/3 h-4 bg-gray-100 rounded-md mb-10" />

        {/* Content Paragraph Skeleton */}
        <div className="w-full space-y-4">
          <div className="w-full h-4 bg-gray-100 rounded-md" />
          <div className="w-11/12 h-4 bg-gray-100 rounded-md" />
          <div className="w-4/5 h-4 bg-gray-100 rounded-md" />
          <div className="w-full h-4 bg-gray-100 rounded-md" />
          <div className="w-3/4 h-4 bg-gray-100 rounded-md" />
        </div>

        {/* Footer actions skeleton */}
        <div className="w-full flex justify-between items-center mt-10">
          <div className="w-24 h-8 bg-gray-200 rounded-full" />
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100" />
            <div className="w-8 h-8 rounded-full bg-gray-100" />
            <div className="w-8 h-8 rounded-full bg-gray-100" />
          </div>
        </div>

      </div>
    </div>
  );
}