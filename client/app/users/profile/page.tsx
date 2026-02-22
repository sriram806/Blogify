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

    if (loading) {
        return (
            <main className="bg-gray-50 min-h-screen">
                <section className="container mx-auto px-5 py-10 max-w-4xl animate-pulse">

                    {/* Back button skeleton */}
                    <div className="h-4 w-32 bg-gray-200 rounded mb-6" />

                    {/* Profile card skeleton */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl bg-gray-200" />

                            {/* Info */}
                            <div className="flex-1 space-y-3 w-full">
                                <div className="h-5 w-48 bg-gray-200 rounded" />
                                <div className="h-4 w-64 bg-gray-200 rounded" />
                                <div className="h-4 w-full max-w-md bg-gray-200 rounded" />

                                <div className="h-8 w-32 bg-gray-200 rounded-full mt-2" />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <div className="h-10 w-24 bg-gray-200 rounded-full" />
                                <div className="h-10 w-24 bg-gray-200 rounded-full" />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
                            <div className="h-10 bg-gray-200 rounded" />
                            <div className="h-10 bg-gray-200 rounded" />
                            <div className="h-10 bg-gray-200 rounded" />
                        </div>
                    </div>

                    {/* Blog skeletons */}
                    <div className="mt-12 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4"
                            >
                                <div className="w-24 h-16 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
            </main>
        );
    }

    if (!user) {
        return (
            <NotAuthenticated />
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <section className="container mx-auto px-5 py-5 max-w-6xl">

                <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <FaArrowLeft /> Back to Blogs
                </Link>

                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
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

                            <div className="flex gap-2">
                                {user.instagram && (
                                    <a
                                        href={`https://instagram.com/${user.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        <FaInstagram className="text-pink-500 hover:text-pink-600" /> @{user.instagram}
                                    </a>
                                )}

                                {user.facebook && (
                                    <a
                                        href={`https://facebook.com/${user.facebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        <FaSquareFacebook className="text-sky-600 hover:text-sky-500" /> @{user.facebook}
                                    </a>
                                )}

                                {user.linkedin &&(
                                    <a
                                        href={`https://linkedin.com/in/${user.linkedin}`}
                                        target="_blank"                                        
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        <FaLinkedin className="text-sky-400 hover:text-sky-500" /> @{user.linkedin}
                                    </a>
                                )}
                            </div>

                            {user.bio && (
                                <p className="mt-2 text-gray-700 max-w-xl">{user.bio}</p>
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