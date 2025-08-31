'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { BlogPost, BlogFilterState } from '@/types/blogs'
interface BlogFiltersProps {
  onFilterChange: (filters: BlogFilterState) => void
  blogs: BlogPost[]
}
export default function BlogFilters({ onFilterChange, blogs }: BlogFiltersProps) {
  const [filters, setFilters] = useState<BlogFilterState>({
    categories: [],
    tags: [],
    authors: []
  })
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    authors: true
  })
  const categories = Array.from(new Set(blogs.map(blog => blog.category.name)))
  const tags = Array.from(new Set(blogs.flatMap(blog => blog.tags.map(tag => tag.name))))
  const authors = Array.from(new Set(blogs.map(blog => blog.author.name)))
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked 
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag)
    const newFilters = { ...filters, tags: newTags }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  const handleAuthorChange = (author: string, checked: boolean) => {
    const newAuthors = checked 
      ? [...filters.authors, author]
      : filters.authors.filter(a => a !== author)
    const newFilters = { ...filters, authors: newAuthors }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  const clearAllFilters = () => {
    const clearedFilters = { categories: [], tags: [], authors: [] }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }
  const hasActiveFilters = filters.categories.length > 0 || filters.tags.length > 0 || filters.authors.length > 0
  return (
    <div className="space-y-6">
      {}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
      {}
      {categories.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-slate-800 dark:text-white">Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                    {category}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {blogs.filter(blog => blog.category.name === category).length}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {}
      {tags.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-slate-800 dark:text-white">Tags</h4>
            {expandedSections.tags ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>
          {expandedSections.tags && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tags.map(tag => (
                <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                    {tag}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {blogs.filter(blog => blog.tags.some(t => t.name === tag)).length}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {}
      {authors.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('authors')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-medium text-slate-800 dark:text-white">Authors</h4>
            {expandedSections.authors ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>
          {expandedSections.authors && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {authors.map(author => (
                <label key={author} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.authors.includes(author)}
                    onChange={(e) => handleAuthorChange(author, e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors">
                    {author}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {blogs.filter(blog => blog.author.name === author).length}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}