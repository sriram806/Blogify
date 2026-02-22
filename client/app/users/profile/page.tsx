"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/Components/Auth/AuthProvider";
import { FaEdit, FaInstagram, FaArrowLeft, FaShareAlt } from "react-icons/fa";
import Link from "next/link";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { ALL_BLOGS } from "@/Components/Blog/blog.data";
import EditProfileModal from "@/Components/Profile/EditProfileModal";
import { NotAuthenticated } from "@/Components/Utils/NotAuthenticated";
import { FaLinkedin, FaSquareFacebook } from "react-icons/fa6";

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userBlogs = ALL_BLOGS.slice(0, 3);

  const stats = [
    { label: "Blogs", value: userBlogs.length },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "342" },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${user?.name}'s Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied!");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50" />;
  if (!user) return <NotAuthenticated />;

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-6xl">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 mb-4 md:mb-6"
        >
          <FaArrowLeft /> Back to Blogs
        </Link>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 md:p-8 shadow-sm">

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">

            {/* Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
              {user.image ? (
                <Image src={user.image} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl font-bold text-white bg-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left w-full">

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.name}
              </h1>

              <p className="text-gray-600 text-sm sm:text-base">
                {user.email}
              </p>

              {/* Social */}
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">

                {user.instagram && (
                  <a
                    href={`https://instagram.com/${user.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaInstagram className="text-pink-500" />
                    @{user.instagram}
                  </a>
                )}

                {user.facebook && (
                  <a
                    href={`https://facebook.com/${user.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaSquareFacebook className="text-sky-600" />
                    @{user.facebook}
                  </a>
                )}

                {user.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaLinkedin className="text-blue-500" />
                    @{user.linkedin}
                  </a>
                )}

              </div>

              {user.bio && (
                <p className="mt-3 text-gray-700 text-sm sm:text-base max-w-xl mx-auto md:mx-0">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 rounded-full bg-black text-white flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-full border border-gray-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <FaShareAlt /> Share
              </button>

            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 md:mt-8 pt-6 border-t border-gray-200">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BLOGS */}
        <section className="mt-10 md:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            Latest Blogs
          </h2>

          <div className="space-y-4">
            {userBlogs.map((blog) => (
              <BlogRowCard key={blog.id} {...blog} readTime={`${blog.readMinutes} min`} />
            ))}
          </div>
        </section>

      </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </main>
  );
}