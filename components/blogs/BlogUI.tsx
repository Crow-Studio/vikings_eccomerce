"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type * as React from "react"
import Image from "next/image"
import { Heart, Clock, Eye, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useWishlistStore } from "@/store/wishlist-store"
import BlogSkeleton from "./BlogSkeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { BlogPost } from "@/types/blogs"
interface BlogUIProps {
  blogs?: BlogPost[]
  blog?: BlogPost
  isLoading?: boolean
  itemsPerPage?: number
  showPagination?: boolean
}
function isNewPost(publishedAt: string | null, createdAt: string): boolean {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const postDate = publishedAt ? new Date(publishedAt) : new Date(createdAt)
  return postDate > sevenDaysAgo
}
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
function BlogCard({ blog }: { blog: BlogPost }) {
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isWishlisted } = useWishlistStore()
  const isNew = isNewPost(blog.published_at, blog.created_at)
  const isCurrentlyWishlisted = isWishlisted(blog.id)
  const publishDate = blog.published_at || blog.created_at
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentlyWishlisted) {
      removeWishlistItem(blog.id)
    } else {
      addWishlistItem({
        id: blog.id,
        name: blog.title,
        price: 0, 
        image: blog.featured_image || "/placeholder.svg",
        selectedVariants: {},
      })
    }
  }
  return (
    <Link href={`/blogs/${blog.slug}`} className="block">
      <article className="group cursor-pointer bg-white dark:bg-background rounded-2xl shadow-lg border border-slate-200/60 dark:border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {}
        <div className="h-48 sm:h-56 relative overflow-hidden">
          {}
          {isNew && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                New
              </span>
            </div>
          )}
          {}
          {blog.featured && (
            <div className="absolute top-4 left-20 z-10">
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                Featured
              </span>
            </div>
          )}
          {}
          <button
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist shadow-sm"
            aria-label="Add to reading list"
          >
            <Heart
              className={cn(
                "w-4 h-4 text-gray-600 group-hover/wishlist:text-black transition-colors duration-200",
                isCurrentlyWishlisted &&
                  "fill-red-500 text-red-500 group-hover/wishlist:fill-red-600 group-hover/wishlist:text-red-600",
              )}
            />
          </button>
          <Image
            src={blog.featured_image || "/placeholder.svg?height=240&width=400&text=Blog Image"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {}
          <div className="absolute bottom-4 left-4">
            <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
              {blog.category.name}
            </span>
          </div>
        </div>
        {}
        <div className="p-6 space-y-4">
          {}
          <h2 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {blog.title}
          </h2>
          {}
          <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>
          {}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-slate-400">
                  +{blog.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          {}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              {}
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{blog.author.name}</span>
              </div>
              {}
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{blog.reading_time} min read</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {}
              <div className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{blog.views} views</span>
              </div>
              {}
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{formatDate(publishDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
export default function BlogUI({
  blogs = [],
  blog,
  isLoading = false,
  itemsPerPage = 9,
  showPagination = true,
}: BlogUIProps) {
  const [currentPage, setCurrentPage] = useState(1)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    )
  }
  if (blog) {
    return <BlogCard blog={blog} />
  }
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg mb-2">No blog posts found</div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Check back later for new content!
        </p>
      </div>
    )
  }
  const totalPages = Math.ceil(blogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBlogs = blogs.slice(startIndex, endIndex)
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }
  return (
    <div className="space-y-8">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      {}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination>
            <PaginationContent>
              {}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1)
                    }
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {}
              {getPageNumbers()[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(1)
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {getPageNumbers()[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              {}
              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(totalPages)
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1)
                    }
                  }}
                  className={cn(
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}