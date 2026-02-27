"use client";

import Image from "next/image";
import Link from "next/link";
import { FaComment, FaEye, FaHeart } from "react-icons/fa";

type BlogRowCardProps = {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  author: string;
  authorImage?: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  likes?: number;
  comments?: number;
  views?: number;
};

export default function BlogRowCard({
  id,
  slug,
  title,
  excerpt,
  author,
  authorImage,
  coverImage,
  publishedAt,
  readTime,
  category,
  likes = 0,
  comments = 0,
  views = 0,
}: BlogRowCardProps) {
  return (
    <Link href={`/blog/${slug || id}`}>
      <article className="group rounded-2xl border border-gray-200 bg-white p-4 md:p-5 hover:border-gray-300 hover:shadow-md transition">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative h-44 md:h-36 md:w-56 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="inline-flex rounded-full bg-black text-white px-2.5 py-1 font-medium">
                {category}
              </span>
              <span className="text-gray-500">{publishedAt}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{readTime} read</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition line-clamp-2">
              {title}
            </h3>
            <p className="mt-2 text-gray-600 line-clamp-2">{excerpt}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {authorImage && (
                  <Image
                    src={authorImage}
                    alt={author}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">{author}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <FaHeart className="text-xs" /> {likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaComment className="text-xs" /> {comments}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaEye className="text-xs" /> {views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}