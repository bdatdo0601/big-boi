import NextError from 'next/error';
import Head from 'next/head';
import { BlogPostWithSlug, getAllPostSlugs, getPostBySlug } from '@/api/blog';
import PostRenderer from '@/components/PostRenderer';

export const revalidate = 3600; // Revalidate every hour

export async function getStaticPaths() {
  const posts = await getAllPostSlugs();
  return {
    paths: posts.map(post => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  return {
    props: {
      post,
    },
    revalidate: 30,
  };
}

export default function BlogPost({ post }: { post?: BlogPostWithSlug }) {
  if (!post) return <NextError statusCode={404} />;
  return (
    <article className="mx-auto py-8">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PostRenderer post={post} />
    </article>
  );
}
