import { getAllPosts } from '@/api/blog'
import Blogs from './Blogs';

export const revalidate = 3600 // Revalidate every hour

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <Blogs posts={posts} />
  )
}
