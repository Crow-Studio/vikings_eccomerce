// components/blogs/BlogPosts.tsx
"use client"

import type React from "react"
import { BookOpen } from "lucide-react"
import BlogUI from "./BlogUI"
import { BlogPost } from "@/types/blogs"

interface BlogPostsComponentProps {
  blogs?: BlogPost[];
  filters: {
    categories: string[];
    tags: string[];
    authors: string[];
  };
  searchQuery: string;
  sortBy: string;
  viewMode: string;
}

const BlogPosts: React.FC<BlogPostsComponentProps> = ({
  blogs = [],
  filters,
  searchQuery,
  sortBy,
  viewMode
}) => {
  const filteredBlogs = blogs.filter((blog: BlogPost) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(blog.category.name)

    const matchesTag =
      filters.tags.length === 0 ||
      blog.tags.some(tag => filters.tags.includes(tag.name))

    const matchesAuthor =
      filters.authors.length === 0 ||
      filters.authors.includes(blog.author.name)

    return matchesSearch && matchesCategory && matchesTag && matchesAuthor
  })

  const sortedBlogs = [...filteredBlogs].sort((a: BlogPost, b: BlogPost) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
      case "oldest":
        return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime()
      case "most-viewed":
        return b.views - a.views
      case "reading-time":
        return a.reading_time - b.reading_time
      case "featured":
        // Sort featured posts first, then by newest
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
      default:
        return 0
    }
  })

  if (sortedBlogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 flex justify-center">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-slate-500 text-lg">No blog posts found matching your criteria.</p>
        <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  // Use viewMode to determine grid layout
  const gridClasses = viewMode === 'list'
    ? "grid grid-cols-1 gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClasses}>
      {sortedBlogs.map((blog: BlogPost) => (
        <BlogUI key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogPosts