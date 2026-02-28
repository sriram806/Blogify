import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const BlogNotFound = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-5 sm:px-6 md:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
          <p className="mt-2 text-gray-600">{errorMessage || "The article you're looking for doesn't exist."}</p>
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            <FaArrowLeft /> Back to Blogs
          </Link>
        </div>
      </section>
    </main>
  );
};

export default BlogNotFound;