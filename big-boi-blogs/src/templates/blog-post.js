import React, { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Badge, Box, Text, Themed, Link } from "theme-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { mix } from "@theme-ui/color";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";
import { Link as GatsbyLink } from "gatsby";
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

import { PageElement } from "../components/page-element";

import PageLayout from "../layouts/page-layout";
import { mdxTheme } from "../gatsby-plugin-theme-ui";
import slugify from "slugify";
import { get } from "lodash";
import { isIframe } from "../utils";
import { useConfig } from "../data/use-config";

const formatDate = date => format(new Date(date), "d-MMM-u");
const ThemedComponents = Object.keys(mdxTheme)
  .filter(item => !["root", "focus", "small", "ul", "li", "progress", "donut", "spinner"].includes(item))
  .reduce((acc, currentKey) => ({ ...acc, [currentKey]: Themed[currentKey] }), {});

const BlogPost = ({ pageContext: { title, data } }) => {
  const {
    site: { siteMetadata },
  } = useConfig();
  useEffect(() => {
    if (isIframe()) {
      window.parent.postMessage(
        JSON.stringify({
          site: { name: title },
          path: `/${slugify(title)}`,
        }),
        "*"
      );
    }
  }, [title]);
  const blogLink = `${siteMetadata.siteUrl}/${slugify(title)}`;
  const readingStats = useMemo(() => readingTime(get(data, "data.text", "")), [data]);
  if (data.postType) {
    return <h1>{title}</h1>;
  }
  return (
    <PageElement>
      <PageLayout siteDescription={get(data, "description", "")}>
        <GatsbyLink
          to="/"
          onClick={e => {
            if (isIframe()) {
              window.parent.postMessage(
                JSON.stringify({
                  site: siteMetadata,
                  path: "/",
                  navigateToPath: true,
                }),
                "*"
              );
              e.preventDefault();
            }
          }}
          style={{ textDecoration: "none" }}
        >
          <Link as="div" sx={{ color: "secondary", ":hover": { cursor: "pointer" } }}>
            <FaArrowLeft /> Back for more posts
          </Link>
        </GatsbyLink>
        <Box sx={{ marginBottom: 3, marginTop: 3 }}>
          {data.tags.map((item, index) => (
            <Badge
              key={index}
              variant="primary"
              sx={{
                mb: 2,
                mr: 2,
                color: mix("muted", "primary", `${index / data.tags.length}`),
                borderColor: mix("muted", "primary", `${index / data.tags.length}`),
              }}
            >
              {item}
            </Badge>
          ))}
        </Box>
        <Box
          sx={{
            width: ["100%", "100%"],
          }}
        >
          <Text as="div" sx={{ color: "muted", display: "flex", alignContent: "center" }}>
            Share:{" "}
            <FacebookShareButton url={blogLink} style={{ marginLeft: 2, marginRight: 2 }}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={blogLink} style={{ marginLeft: 2, marginRight: 2 }}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={blogLink} style={{ marginLeft: 2, marginRight: 2 }}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <RedditShareButton url={blogLink} style={{ marginLeft: 2, marginRight: 2 }}>
              <RedditIcon size={32} round />
            </RedditShareButton>
            <EmailShareButton url={blogLink} style={{ marginLeft: 2, marginRight: 2 }}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </Text>
        </Box>
        <Box
          sx={{
            width: ["100%", "100%"],
          }}
        >
          {data.updatedAt && (
            <Text
              as="div"
              sx={{
                color: "muted",
                textAlign: ["left"],
                marginTop: 2,
              }}
            >
              {readingStats.text} - {readingStats.words} words
            </Text>
          )}
        </Box>
        <Box
          sx={{
            width: ["100%", "100%"],
          }}
        >
          {data.createdAt && (
            <Text as="div" sx={{ color: "muted" }}>
              Date published: {formatDate(data.createdAt)}
            </Text>
          )}
        </Box>
        <Box
          sx={{
            width: ["100%", "100%"],
          }}
        >
          {data.updatedAt && (
            <Text
              as="div"
              sx={{
                color: "muted",
                textAlign: ["left"],
                marginBottom: 4,
              }}
            >
              Date modified: {formatDate(data.updatedAt)}
            </Text>
          )}
        </Box>
        <Themed.h1>{title}</Themed.h1>
        <ReactMarkdown
          components={{
            ...ThemedComponents,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={nightOwl}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img: Themed.img,
          }}
        >
          {data.data.text}
        </ReactMarkdown>
      </PageLayout>
    </PageElement>
  );
};

export default BlogPost;
