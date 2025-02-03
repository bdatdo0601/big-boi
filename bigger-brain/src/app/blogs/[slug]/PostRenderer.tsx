"use client"

import React, { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import readingTime from "reading-time/lib/reading-time";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

import slugify from "slugify";
import { get } from "lodash";
import { isIframe } from "@/utils";
import { BlogPostWithSlug } from "@/api/blog";

interface PostRendererProps {
  post: BlogPostWithSlug
}

const formatDate = (date: string) => format(new Date(date), "d-MMM-u");

const PostRenderer: React.FC<PostRendererProps> = ({ post }) => {
  const data = JSON.parse(post.data);
  useEffect(() => {
    if (isIframe()) {
      window.parent.postMessage(
        JSON.stringify({
          site: { name: post.title },
          path: `/${slugify(post.title)}`,
        }),
        "*"
      );
    }
  }, [post.title]);

  const blogLink = `/${slugify(post.title)}`;
  const readingStats = useMemo(() => readingTime(get(data, "text", "")), [data]);

  if (data.postType) {
    return <h1>{post.title}</h1>;
  }

  return (
    <div className="px-2 max-w-[1000px] mx-auto">
      <div className="flex flex-col items-start gap-2">
        <Link
          href="/blogs"
          onClick={(e) => {
            if (isIframe()) {
              window.parent.postMessage(
                JSON.stringify({
                  site: "/",
                  path: "/",
                  navigateToPath: true,
                }),
                "*"
              );
              e.preventDefault();
            }
          }}
          className="text-muted-foreground hover:cursor-pointer no-underline flex flex-row items-center gap-2 w-fit"
        >
          <FaArrowLeft /> Back for more posts
        </Link>
        <div className="flex flex-row flex-wrap gap-1 my-2">
          {post.tags.map((item, index) => (
            <span
              key={index}
              className={`inline-block rounded-full px-3 text-lg bg-secondary text-secondary-foreground`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="w-full">
          <div className="text-input flex items-center flex-wrap gap-4">
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
          {post.createdAt && (
            <div className="text-input">Date published: {formatDate(post.createdAt)}</div>
          )}
        </div>
        <div className="w-full">
          {post.updatedAt && (
            <div className="text-input text-left mb-4">
              Date modified: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>
        <h1 className="font-bold mb-6">{post.title}</h1>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={nightOwl}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // biome-ignore lint/a11y/useAltText: <explanation>
            img: (props) => <img {...props} className="max-w-full h-auto" />,
          }}
        >
          {data.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostRenderer;
