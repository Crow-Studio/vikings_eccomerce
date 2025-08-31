export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  published: boolean;
  featured: boolean;
  reading_time: number; 
  views: number;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
}
export interface BlogFilterState {
  categories: string[];
  tags: string[];
  authors: string[];
}
export type BlogSortBy = 'featured' | 'newest' | 'oldest' | 'most-viewed' | 'reading-time';