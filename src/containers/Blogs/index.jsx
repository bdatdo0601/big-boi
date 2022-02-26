import React, { useMemo } from "react";
import { Typography, useMediaQuery } from "@mui/material";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";

import { useAWSAPI } from "../../utils/awsAPI";
import { postByUpdatedAt } from "../../graphql/queries";
import { POST_STATE } from "../../utils/constants";
import BlogPostCard from "../../components/BlosPostCard";
import "./index.less";

const BlogPostSource = {
  NOTION: "notion",
};

export default function Blogs() {
  const isWeb = useMediaQuery("(min-width:1200px)");
  const query = useMemo(() => ({ status: POST_STATE.PUBLISHED, sortDirection: "DESC", limit: 10000 }), []);
  const history = useHistory();
  const { data: rawData } = useAWSAPI(postByUpdatedAt, query, "API_KEY");
  const posts = useMemo(() => get(rawData, "data.PostByUpdatedAt.items", []), [rawData]);
  return (
    <div className="blog-container-div">
      <Typography variant={isWeb ? "h2" : "h4"} style={{ marginBottom: 12 }}>
        Blogs & Thoughts
      </Typography>
      <Masonry breakpointCols={isWeb ? 3 : 1} className="masonry-blog" columnClassName="masonry-blog-column">
        {posts.map(post => (
          <BlogPostCard
            key={get(post, "id")}
            width="100%"
            post={post}
            showState={false}
            onPostClick={() => {
              switch (get(post, "postType")) {
                case BlogPostSource.NOTION:
                  window.open(get(post, "externalLink"));
                  break;
                case null:
                  history.push(`/blogs/post/${get(post, "id")}`);
                  break;
                default:
                  break;
              }
            }}
          />
        ))}
      </Masonry>
    </div>
  );
}
