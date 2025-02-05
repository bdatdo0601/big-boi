import { gql, GraphQLClient } from 'graphql-request';
import { isEmpty } from 'lodash';
import slugify from 'slugify';

const client = new GraphQLClient(process.env.BLOGPOST_APPSYNC_API_URL!, {
  headers: {
    'x-api-key': process.env.BLOGPOST_APPSYNC_API_KEY!,
  },
});

export interface BlogPost {
  id: string;
  title: string;
  createdAt: string;
  data: string;
  description: string;
  externalLink?: string;
  owner: string;
  postType: string;
  status: string;
  tags: string[];
  updatedAt: string;
  comments?: {
    items: {
      content: string;
      createdAt: string;
      id: string;
      owner: string;
      updatedAt: string;
      postID: string;
    }[];
  };
}

export type BlogPostWithSlug = BlogPost & { slug: string };

// Query to get all posts for the index page
const GET_ALL_POSTS = gql`
  query GetAllPosts {
  listPosts {
    nextToken
    items {
      comments {
        items {
          content
          createdAt
          id
          owner
          updatedAt
          postID
        }
      }
      createdAt
      data
      description
      externalLink
      id
      owner
      postType
      status
      tags
      title
      updatedAt
    }
  }
}
`;

// In-memory cache for slug to ID mapping
let slugToIdMap: Map<string, string> | null = null;

// Initialize or get the slug to ID mapping
async function getSlugToIdMap(): Promise<Map<string, string>> {
  if (slugToIdMap) return slugToIdMap;

  const { listPosts } = await client.request<{ listPosts: { items: BlogPost[] } }>(GET_ALL_POSTS);
  // only list slugify post created directly
  slugToIdMap = new Map(
    listPosts.items.filter((post: BlogPost) => isEmpty(post.postType)).map((post: any) => [slugify(post.title), post.id])
  );

  return slugToIdMap;
}

// Query to get a single post by ID
const GET_POST_BY_ID = `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      comments {
        items {
          content
          createdAt
          id
          owner
          updatedAt
          postID
        }
      }
      createdAt
      data
      description
      externalLink
      id
      owner
      postType
      status
      tags
      title
      updatedAt
    }
  }
`;
export async function getAllPostSlugs() {
  const map = await getSlugToIdMap();
  return Array.from(map.keys()).map(slug => ({ slug }));
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithSlug> {
  const map = await getSlugToIdMap();
  const decodedSlug = decodeURIComponent(slug);
  const id = map.get(decodedSlug);
  if (!id) {
    throw new Error('Post not found');
  }

  const { getPost } = await client.request<{ getPost: BlogPost }>(GET_POST_BY_ID, { id });
  return {
    ...getPost,
    slug, // Add the slug to the response
  };
}

export async function getAllPosts(): Promise<BlogPostWithSlug[]> {
  const { listPosts } = await client.request<{ listPosts: { items: BlogPost[] } }>(GET_ALL_POSTS);
  return listPosts.items
    .filter((post) => post.status === 'PUBLISHED')
    .map((post: any) => ({
      ...post,
      slug: slugify(post.title),
    }))
    .sort((a: BlogPost, b: BlogPost) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
