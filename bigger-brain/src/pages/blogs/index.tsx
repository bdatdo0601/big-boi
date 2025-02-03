import { BlogPostWithSlug, getAllPosts } from '@/api/blog'
import Blogs from '@/components/Blogs';

export const revalidate = 3600 // Revalidate every hour

export async function getStaticProps() {
  const posts = await getAllPosts()
  return {
    props: {
      posts,
    },
  }
}

export default function BlogIndex({ posts }: { posts: BlogPostWithSlug[] }) {

  return (
    <Blogs posts={posts} />
  )
}
