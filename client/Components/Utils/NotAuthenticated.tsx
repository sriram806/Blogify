import Link from "next/link";
import { FaArrowLeft, FaLock } from "react-icons/fa";

export const NotAuthenticated = () => {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center">

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
          <FaLock className="text-gray-500 text-xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          You’re not signed in
        </h1>

        {/* Description */}
        <p className="text-gray-600 mt-2">
          Please log in to access your profile and personalized content.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            Go to Login
          </Link>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition inline-flex items-center gap-2 justify-center"
          >
            <FaArrowLeft /> Back Home
          </Link>

        </div>
      </div>

    </main>
  );
};