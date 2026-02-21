"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";

type BlogCardProps = {
  id: string;
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

const BlogCard = ({
  id,
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
}: BlogCardProps) => {
  return (
    <Link href={`/blog/${id}`}>
      <div className="group h-full rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 grow">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{publishedAt}</span>
            <span>•</span>
            <span>{readTime} read</span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            {authorImage && (
              <Image
                src={authorImage}
                alt={author}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-medium text-gray-700">{author}</span>
          </div>

          {/* Engagement */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1 hover:text-red-600 transition">
              <FaHeart className="text-xs" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-blue-600 transition">
              <FaComment className="text-xs" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-600 transition">
              <FaEye className="text-xs" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
