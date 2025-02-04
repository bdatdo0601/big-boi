import { BlogPostWithSlug, getAllPosts } from '@/api/blog'
import Blogs from '@/components/Blogs';
import { uniqBy } from 'lodash';

export const revalidate = 3600 // Revalidate every hour

export async function getStaticProps() {
  const posts = await getAllPosts()
  return {
    props: {
      posts: uniqBy(posts, (post) => post.externalLink || post.id),
    },
    revalidate: 30
  }
}

export default function BlogIndex({ posts }: { posts: BlogPostWithSlug[] }) {

  return (
    <Blogs posts={posts} />
  )
}
