import { getAllPostSlugs, getPostBySlug } from '@/api/blog'
import { notFound } from 'next/navigation'
import PostRenderer from './PostRenderer'

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const posts = await getAllPostSlugs()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({
  params,
}: PageProps) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug)
    
    return (
      <article className="max-w-4xl mx-auto py-8">
        <PostRenderer post={post} />
      </article>
    )
  } catch (e) {
    notFound()
  }
}