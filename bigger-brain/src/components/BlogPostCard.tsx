'use client';

import { format } from 'date-fns';
import { capitalize, get, trim } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import { Tweet } from 'react-twitter-widgets';
import slugify from 'slugify';
import { BlogPostWithSlug } from '@/api/blog';
import { isIframe } from '@/utils';

const BlogPostSource = {
  NOTION: 'notion',
  Twitter: 'Twitter',
  Instagram: 'Instagram',
};

const BlogPost = ({ post }: { post: BlogPostWithSlug }) => {
  return (
    <div key={post.id} className="shadow-2xl bg-popover p-4 rounded-xl border-input h-full">
      <a
        href={!post.postType ? `/blogs/${slugify(post.title)}` : post.externalLink!}
        target={!post.postType ? '_self' : '_blank'}
        suppressHydrationWarning
        onClick={e => {
          if (!post.postType && isIframe()) {
            window.parent.postMessage(
              JSON.stringify({
                site: { name: post.title },
                path: `/${slugify(post.title)}`,
                navigateToPath: true,
              }),
              '*'
            );
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4>{post.title}</h4>
            <time className="text-muted-foreground">{format(new Date(post.createdAt), 'd-MMM-u')}</time>
          </div>
          <blockquote className="my-2">
            <h6>{post.description}</h6>
          </blockquote>
          <h5>{!post.postType ? 'View Post' : `Go to ${capitalize(post.postType)}`}</h5>
        </div>
      </a>
    </div>
  );
};

const TwitterBlogPost = ({ post }: { post: BlogPostWithSlug }) => {
  const [loaded, setLoaded] = useState(false);
  const postData = useMemo(() => JSON.parse(get(post, 'data', '{}')), [post]);
  return (
    <div className="tweet-wrapper min-h-[207px]">
      {!loaded && <BlogPost post={{ ...post, title: 'Tweet' }} />}
      <Tweet
        tweetId={get(postData, 'tweetID', '')}
        options={{ theme: 'dark', align: 'center' }}
        onLoad={() => {
          setLoaded(true);
        }}
      />
    </div>
  );
};

const InstagramBlogPost = ({ post }: { post: BlogPostWithSlug }) => {
  const postData = useMemo(() => JSON.parse(get(post, 'data', '{}')), [post]);
  const link = useMemo(() => get(postData, 'link', '').replace('instagr.am', 'instagram.com'), [postData]);
  return (
    <div className="p-2 shadow-2xl bg-popover rounded-xl border-input">
      <a href={post.externalLink || ''} target="_blank" style={{ textDecoration: 'inherit' }} rel="noreferrer">
        <div>
          <InstagramEmbed
            url={link}
            width="100%"
            embedPlaceholder={
              <div className="mb-4 min-h-[574px] w-full text-center pt-4 flex flex-col bg-input">
                <h4 className="text-muted-foreground mx-auto my-auto">Instagram Post...</h4>
              </div>
            }
          />
          <div>
            <time className="text-muted-foreground">{format(new Date(post.createdAt), 'd-MMM-u')}</time>
            <blockquote className="my-4">{post.description}</blockquote>
          </div>
          <div>
            <h5>{`Go to ${capitalize(post.postType)}`}</h5>
          </div>
        </div>
      </a>
    </div>
  );
};

const GeneralBlogPostCard = ({ post, ...props }: { post: BlogPostWithSlug }) => {
  switch (get(post, 'postType')) {
    case BlogPostSource.NOTION:
    case null:
      return <BlogPost post={post} {...props} />;
    case BlogPostSource.Twitter:
      return <TwitterBlogPost post={post} {...props} />;
    case BlogPostSource.Instagram:
      return <InstagramBlogPost post={post} {...props} />;
    default:
      return get(post, 'postType');
  }
};

const BlogPostCard: React.FC<{ index: number; data: BlogPostWithSlug; width: number }> = ({
  index,
  data: post,
  width,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div className="w-full p-2">{isClient && <GeneralBlogPostCard post={post} />}</div>;
};

export default BlogPostCard;
