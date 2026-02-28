"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaSquareFacebook } from "react-icons/fa6";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { fetchAllBlogs, fetchUserProfileById, PublicUserProfile } from "@/Components/Blog/blog.api";
import { BlogItem } from "@/Components/Blog/blog.types";

const toHandleSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "author";

export default function AuthorProfilePage() {
  const params = useParams();
  const rawSegment = String(params.id || "").trim();
  const decodedSegment = decodeURIComponent(rawSegment);

  const newPatternMatch = decodedSegment.match(/^([^@]+)@user=(.+)$/i);
  const oldPatternMatch = decodedSegment.match(/^uid=([^@]+)@(.+)$/i);

  const uidFromSegment = (newPatternMatch?.[1] || oldPatternMatch?.[1] || "").trim();
  const handleFromSegment = (newPatternMatch?.[2] || oldPatternMatch?.[2] || "").trim();
  const handle = (handleFromSegment || decodedSegment).replace(/^@+/, "");

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!handle) {
        setErrorMessage("Invalid author profile.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const normalizedHandle = toHandleSlug(handle);
      const uid = uidFromSegment;

      const blogsResponse = await fetchAllBlogs();
      if (!blogsResponse.ok) {
        setProfile(null);
        setLatestBlogs([]);
        setErrorMessage(blogsResponse.message || "Unable to load author profile.");
        setLoading(false);
        return;
      }

      const authorBlogs = blogsResponse.blogs
        .filter((blog) => {
          if (uid && String(blog.authorId || "") === uid) return true;
          return toHandleSlug(blog.author || "") === normalizedHandle;
        })
        .sort((a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime());

      setLatestBlogs(authorBlogs.slice(0, 3));

      const resolvedAuthorId = uid || String(authorBlogs[0]?.authorId || "").trim();

      if (resolvedAuthorId) {
        const profileResponse = await fetchUserProfileById(resolvedAuthorId);
        if (profileResponse.ok && profileResponse.user) {
          setProfile(profileResponse.user);
          setLoading(false);
          return;
        }
      }

      if (authorBlogs.length > 0) {
        const fallbackName = authorBlogs[0].author || "Author";
        const fallbackImage = authorBlogs[0].authorImage;
        setProfile({
          _id: resolvedAuthorId || "",
          name: fallbackName,
          image: fallbackImage,
        });
        setLoading(false);
        return;
      }

      setProfile(null);
      setErrorMessage("Unable to load this author.");
      setLoading(false);
    };

    load();
  }, [handle, uidFromSegment]);

  const stats = useMemo(
    () => [
      { label: "Blogs", value: latestBlogs.length },
      { label: "Followers", value: "1.2K" },
      { label: "Following", value: "342" },
    ],
    [latestBlogs.length]
  );

  if (loading) {
    return <main className="bg-gray-50 min-h-screen" />;
  }

  if (!profile) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-6xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6">
            <FaArrowLeft /> Back to Blogs
          </Link>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Author Not Found</h1>
            <p className="mt-2 text-gray-600">{errorMessage || "Unable to load this author."}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-6xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-4 md:mb-6">
          <FaArrowLeft /> Back to Blogs
        </Link>

        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl font-bold text-white bg-gray-400">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.name}</h1>
              {profile.email && <p className="text-gray-600 text-sm sm:text-base">{profile.email}</p>}

              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaInstagram className="text-pink-500" />
                    @{profile.instagram}
                  </a>
                )}

                {profile.facebook && (
                  <a
                    href={`https://facebook.com/${profile.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaSquareFacebook className="text-sky-600" />
                    @{profile.facebook}
                  </a>
                )}

                {profile.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaLinkedin className="text-blue-500" />
                    @{profile.linkedin}
                  </a>
                )}
              </div>

              {profile.bio && (
                <p className="mt-3 text-gray-700 text-sm sm:text-base max-w-xl mx-auto md:mx-0">{profile.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 md:mt-8 pt-6 border-t border-gray-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-10 md:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Latest Blogs</h2>

          {latestBlogs.length > 0 ? (
            <div className="space-y-4">
              {latestBlogs.map((blog) => (
                <BlogRowCard
                  key={blog.id}
                  id={blog.id}
                  slug={blog.slug}
                  authorId={blog.authorId}
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No blogs available from this author yet.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
