"use client"

import { BlogPostWithSlug } from '@/api/blog'
import BlogPostCard from './BlogPostCard';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';

const TypedResponsiveMasonry = ResponsiveMasonry as any;

const Blogs = ({ posts }: { posts: BlogPostWithSlug[] }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col gap-2">
      <h1 className="">Dat Do Blogs & Thoughts</h1>
      <h4 className="mb-8 mt-4 text-success">Aggregation of my thoughts from various sources</h4>
      <div className="w-full">
        <TypedResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 900: 2, 1200: 3 }}
          gutterBreakpoints={{ 350: "12px", 900: "16px", 1200: "24px" }}
        >
          <Masonry>
            {isClient && orderBy(posts, "updatedAt", "desc").map((post, index) => <BlogPostCard key={post.id} data={post} index={index} width={350} />)}
          </Masonry>
        </TypedResponsiveMasonry>
      </div>
    </div>
  )
}

export default Blogs;