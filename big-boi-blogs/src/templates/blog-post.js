import React from "react";
import ReactMarkdown from "react-markdown";
import { Badge, Box, Text, Themed, Link } from "theme-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { mix } from "@theme-ui/color";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";
import { Link as GatsbyLink } from "gatsby";

import { PageElement } from "../components/page-element";

import PageLayout from "../layouts/page-layout";
import { mdxTheme } from "../gatsby-plugin-theme-ui";

const formatDate = date => format(new Date(date), "d-MMM-u");
const ThemedComponents = Object.keys(mdxTheme)
  .filter(item => !["root", "focus", "small", "ul", "li", "progress", "donut", "spinner"].includes(item))
  .reduce((acc, currentKey) => ({ ...acc, [currentKey]: Themed[currentKey] }), {});

const BlogPost = ({ pageContext: { title, data } }) => {
  if (data.postType) {
    return <h1>{title}</h1>;
  }
  return (
    <PageElement>
      <PageLayout>
        <GatsbyLink to="/" style={{ textDecoration: "none" }}>
          <Link as="div" sx={{ color: "muted", ":hover": { cursor: "pointer" } }}>
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
