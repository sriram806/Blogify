import React from 'react'

const BlogSkeloten = () => {
  return (
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto px-5 sm:px-6 md:px-8 py-12">
    
    <div className="animate-pulse space-y-8">
      
      {/* Blog Title Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="h-64 bg-gray-300 rounded-xl w-full"></div>

      {/* Blog Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>

    </div>

  </section>
</main>
  )
}

export default BlogSkeloten
