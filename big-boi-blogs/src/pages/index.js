import { graphql, useStaticQuery } from "gatsby";
import React, { useEffect } from "react";
import { Themed } from "theme-ui";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import GeneralBlogPost from "../components/GeneralBlogPost";
import { PageElement } from "../components/page-element";
import PageLayout from "../layouts/page-layout";
import { isIframe } from "../utils";

const Home = () => {
  const { site, allBlogPost } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          description
          name
        }
      }
      allBlogPost(filter: { status: { eq: "PUBLISHED" } }, sort: { fields: updatedAt, order: DESC }) {
        nodes {
          data {
            attributes {
              createdAt
              host
              id
              idUrl
              type
              title
              updatedAt
              url
              archived
            }
            embed
            link
            tweetID
            type
            url
            username
          }
          description
          externalLink
          id
          owner
          postType
          tags
          title
          updatedAt
          createdAt
          status
        }
      }
    }
  `);

  useEffect(() => {
    if (isIframe()) {
      window.parent.postMessage(
        JSON.stringify({
          site: site.siteMetadata,
          path: "/",
        }),
        "*"
      );
    }
  }, [site]);
  return (
    <PageElement>
      <PageLayout>
        <Themed.h1>{site.siteMetadata.name}</Themed.h1>
        <p>{site.siteMetadata.description}</p>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 900: 2, 1200: 3 }}>
          <Masonry>
            {allBlogPost.nodes.map((node, index) => {
              return <GeneralBlogPost key={index} node={node} index={index} />;
            })}
          </Masonry>
        </ResponsiveMasonry>
      </PageLayout>
    </PageElement>
  );
};

export default Home;
