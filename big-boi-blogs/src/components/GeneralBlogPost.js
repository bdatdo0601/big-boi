import { GatsbyImage } from "gatsby-plugin-image";
import React, { useMemo, useState } from "react";
import { Box, Card, Heading, Link, Text } from "theme-ui";
import { Location } from "@reach/router";
import slugify from "slugify";
import { format } from "date-fns";
import { get, capitalize, trim } from "lodash";
import { Tweet } from "react-twitter-widgets";
import { InstagramEmbed } from "react-social-media-embed";
import { isIframe } from "../utils";

const BlogPostSource = {
  NOTION: "notion",
  Twitter: "Twitter",
  Instagram: "Instagram",
};

const BlogPost = ({ node, index }) => (
  <Location>
    {({ location }) => {
      const blogSite = location.hostname === "localhost" ? `http://localhost:8000` : `https://blogs.datbdo.com`;
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            margin: "8px 8px 8px 0px",
            borderRadius: "50%",
          }}
        >
          <Link
            href={!node.postType ? `${blogSite}/${slugify(node.title)}` : node.externalLink}
            target={!node.postType ? "_self" : "_blank"}
            onClick={e => {
              if (!node.postType && isIframe()) {
                window.parent.postMessage(
                  JSON.stringify({
                    site: { name: node.title },
                    path: `/${slugify(node.title)}`,
                    navigateToPath: true,
                  }),
                  "*"
                );
                e.preventDefault();
              }
            }}
            sx={{
              textDecoration: "none",
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              minHeight: "1px",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                minHeight: "1px",
                borderRadius: "10px",
              }}
            >
              <Box sx={{ minHeight: "1px" }}>
                {node.featuredImage ? (
                  <GatsbyImage alt={node.title} image={node.featuredImage.childImageSharp} />
                ) : null}
                {node.featuredImageUrl ? (
                  <GatsbyImage alt={node.title} image={node.featuredImageUrl.childImageSharp} />
                ) : null}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flex: "1 1 auto",
                  flexDirection: "column",
                  p: 3,
                }}
              >
                <Heading variant="styles.h4" sx={{ color: "primary" }}>
                  {node.title}
                </Heading>
                <Text sx={{ mb: 1, color: "muted" }}>{format(new Date(node.createdAt), "d-MMM-u")}</Text>
                <Text sx={{ mb: 1, color: "text" }}>{node.description}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text>{!node.postType ? "View Post" : `Go to ${capitalize(node.postType)}`}</Text>
              </Box>
            </Card>
          </Link>
        </Box>
      );
    }}
  </Location>
);

const TwitterBlogPost = ({ node }) => {
  const [loaded, setLoaded] = useState(false);
  const postData = useMemo(() => get(node, "data", "{}"), [node]);
  return (
    <div className="tweet-wrapper" style={{ margin: "0px 8px 8px 0px" }}>
      {!loaded && <BlogPost node={node} />}
      <Tweet
        tweetId={get(postData, "tweetID")}
        options={{ theme: "dark", align: "center" }}
        onLoad={() => {
          setLoaded(true);
        }}
      />
    </div>
  );
};

const InstagramBlogPost = ({ node, index }) => {
  const postData = useMemo(() => get(node, "data", "{}"), [node]);
  const link = useMemo(() => get(postData, "link", "").replace("instagr.am", "instagram.com"), [postData]);
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        margin: "8px 8px 8px 0px",
        borderRadius: "50%",
      }}
    >
      <Link href={node.externalLink} target="_blank" style={{ textDecoration: "inherit" }}>
        <Card
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            minHeight: "1px",
            borderRadius: "10px",
          }}
        >
          <div style={{ margin: 12 }}>
            <InstagramEmbed
              url={link}
              width="100%"
              embedPlaceholder={
                <BlogPost node={{ ...node, title: `Instagram: "${trim(node.description)}"`, description: "" }} />
              }
            />
          </div>
          <Box
            sx={{
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              px: 3,
            }}
          >
            <Text sx={{ mb: 1, color: "muted" }}>{format(new Date(node.createdAt), "d-MMM-u")}</Text>
            <Text variant="styles.p" sx={{ color: "secondary" }}>
              {node.description}
            </Text>
          </Box>
          <Box sx={{ p: 3 }}>
            <Text>{`Go to ${capitalize(node.postType)}`}</Text>
          </Box>
        </Card>
      </Link>
    </Box>
  );
};

const GeneralBlogPost = ({ node, ...props }) => {
  switch (get(node, "postType")) {
    case BlogPostSource.NOTION:
    case null:
      return <BlogPost node={node} {...props} />;
    case BlogPostSource.Twitter:
      return <TwitterBlogPost node={node} {...props} />;
    case BlogPostSource.Instagram:
      return <InstagramBlogPost node={node} {...props} />;
    default:
      return get(node, "postType");
  }
};

export default GeneralBlogPost;
