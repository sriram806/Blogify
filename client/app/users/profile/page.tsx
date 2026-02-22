"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/Components/Auth/AuthProvider";
import {
  FaEdit,
  FaInstagram,
  FaArrowLeft,
  FaShareAlt,
} from "react-icons/fa";
import Link from "next/link";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { ALL_BLOGS } from "@/Components/Blog/blog.data";
import EditProfileModal from "@/Components/Profile/EditProfileModal";

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  console.log("User data in profile page:", user);
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

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not Authenticated</h1>
          <Link href="/" className="mt-4 inline-flex gap-2 items-center">
            <FaArrowLeft /> Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-5 py-10 max-w-4xl">

        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <FaArrowLeft /> Back to Blogs
        </Link>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-200">
              {user.image ? (
                <Image src={user.image} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl font-bold text-white bg-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>

              {user.bio && (
                <p className="mt-2 text-gray-700 max-w-xl">{user.bio}</p>
              )}

              {user.instagram && (
                <a
                  href={`https://instagram.com/${user.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FaInstagram /> @{user.instagram}
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2 rounded-full bg-black text-white flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={handleShare}
                className="px-5 py-2 rounded-full border border-gray-300 flex items-center gap-2"
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </div>

          {/* ✅ STATS UNDER PROFILE */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* BLOGS */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Latest Blogs
          </h2>

          {userBlogs.length > 0 ? (
            <div className="space-y-4">
              {userBlogs.map((blog) => (
                <BlogRowCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author}
                  authorImage={blog.authorImage}
                  coverImage={blog.coverImage}
                  publishedAt={blog.publishedAt}
                  readTime={`${blog.readMinutes} min`}
                  category={blog.category}
                  likes={blog.likes}
                  comments={blog.comments}
                  views={blog.views}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No blogs yet.</p>
          )}
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