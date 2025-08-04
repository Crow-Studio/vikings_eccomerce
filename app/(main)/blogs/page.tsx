// import OurBlogs from "@/components/blogs/OurBlogs";
import GrainOverlay from "@/components/global/GrainOverlay";
// import { db } from "@/database";
// import { desc } from "drizzle-orm";

export default async function BlogsPage() {
  // Fetch blog posts from database
  // const rawBlogs = await db.query.blogPost.findMany({
  //   with: {
  //     category: true,
  
  //     author: true,
  //     tags: true,
  //   },
  //   where: (table, { eq }) => eq(table.published, true),
  //   orderBy: table => desc(table.created_at)
  // });

  // Transform blogs to match BlogPost type
  // const blogs = rawBlogs.map(blog => ({
  //   ...blog,
  //   created_at: blog.created_at.toISOString(),
  //   updated_at: blog.updated_at?.toISOString() || null,
  //   published_at: blog.published_at?.toISOString() || null,
  // }));

  // Temporary empty array until database schema is ready
  // const blogs = [];

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
      <GrainOverlay/>
      {/* <OurBlogs blogs={blogs} /> */}
      
    </div>
  );
}