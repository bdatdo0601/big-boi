import { BlogPostWithSlug, getAllPostSlugs, getPostBySlug } from '@/api/blog'
import { notFound } from 'next/navigation'
import PostRenderer from '@/components/PostRenderer'
import { Metadata } from 'next'
import Head from 'next/head'

export const revalidate = 3600 // Revalidate every hour

export async function getStaticPaths() {
  const posts = await getAllPostSlugs()
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  } else {
    return {
      props: {
        post,
      },
    }
  }
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
      canonical: `/blogs/${slug}`,
    },
  }
}

export default function BlogPost({
  post,
}: { post: BlogPostWithSlug }) {
  return (
    <article className="max-w-4xl mx-auto py-8">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
      </Head>
      <PostRenderer post={post} />
    </article>
  )
}