'use client';

import { format } from 'date-fns';
// Using ES6 import syntax
import hljs from 'highlight.js';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import readingTime from 'reading-time/lib/reading-time';
import 'highlight.js/styles/atom-one-dark.css';

import { get } from 'lodash';
import slugify from 'slugify';
import { BlogPostWithSlug } from '@/api/blog';
import { isIframe } from '@/utils';

interface PostRendererProps {
  post: BlogPostWithSlug;
}

const formatDate = (date: string) => format(new Date(date), 'd-MMM-u');

const PostRenderer: React.FC<PostRendererProps> = ({ post }) => {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : 'https://blogs.datbdo.com';
  const data = JSON.parse(post.data);
  useEffect(() => {
    if (isIframe()) {
      window.parent.postMessage(
        JSON.stringify({
          site: { name: post.title },
          path: `blogs/${slugify(post.title)}`,
        }),
        '*'
      );
    }
  }, [post.title]);

  const blogLink = `${baseURL}/${slugify(post.title)}`;
  const readingStats = useMemo(() => readingTime(get(data, 'text', '')), [data]);

  if (data.postType) {
    return <h1>{post.title}</h1>;
  }

  return (
    <div className="px-2 max-w-[1000px] mx-auto">
      <div className="flex flex-col items-start gap-2">
        <Link
          href="/blogs"
          onClick={e => {
            if (isIframe()) {
              window.parent.postMessage(
                JSON.stringify({
                  site: { title: post.title },
                  path: '/',
                  navigateToPath: true,
                }),
                '*'
              );
              e.preventDefault();
            }
          }}
          className="text-muted-foreground hover:cursor-pointer no-underline flex flex-row items-center gap-2 w-fit"
        >
          <FaArrowLeft /> Back for more posts
        </Link>
        <div className="flex flex-wrap justify-between items-center gap-2 w-full">
          <div className="flex flex-row flex-wrap gap-2 my-2 py-2">
            {post.tags.map((item, index) => (
              <span
                key={index}
                className={`inline-block shadow-2xl shadow-accent-foreground font-bold rounded-md px-4 py-1 text-base bg-secondary text-secondary-foreground border-secondary-foreground border-1`}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="text-input flex items-center flex-wrap gap-4 bg-popover px-4 py-2 rounded-2xl border-popover-foreground border-1">
            <FacebookShareButton url={blogLink}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={blogLink}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={blogLink}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <RedditShareButton url={blogLink}>
              <RedditIcon size={32} round />
            </RedditShareButton>
            <EmailShareButton url={blogLink}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        </div>
        <div className="w-full">
          {post.updatedAt && (
            <div className="text-input text-left mt-2">
              {readingStats.text} - {readingStats.words} words
            </div>
          )}
        </div>
        <div className="w-full">
          {post.createdAt && <div className="text-input">Date published: {formatDate(post.createdAt)}</div>}
        </div>
        <div className="w-full">
          {post.updatedAt && (
            <div className="text-input text-left mb-4">Date modified: {formatDate(post.updatedAt)}</div>
          )}
        </div>
        <h1 className="font-bold mb-6">{post.title}</h1>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              return (
                <code
                  className={className}
                  {...props}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: highlight styling
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlightAuto(children).value,
                  }}
                />
              );
            },
            img: props => <img alt="custom alt text" {...props} className="max-w-full h-auto" />,
          }}
        >
          {data.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostRenderer;
