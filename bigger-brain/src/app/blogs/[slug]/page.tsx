import { getAllPostSlugs, getPostBySlug } from '@/api/blog'
import { notFound } from 'next/navigation'
import PostRenderer from './PostRenderer'
import { Metadata, ResolvingMetadata } from 'next'

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

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug)
 
  return {
    title: `Dat's Blog: ${post.title}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `/${slug}`,
    },
  }
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