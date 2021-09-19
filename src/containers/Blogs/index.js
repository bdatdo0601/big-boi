import React, { useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { useAWSAPI } from "../../utils/awsAPI";
import { postByUpdatedAt } from "../../graphql/queries";
import { POST_STATE } from "../../utils/constants";
import BlogPostCard from "../../components/BlosPostCard";
import "./index.less";

export default function Blogs() {
  const query = useMemo(() => ({ status: POST_STATE.PUBLISHED, sortDirection: "DESC", limit: 10000 }), []);
  const history = useHistory();
  const { data: rawData } = useAWSAPI(postByUpdatedAt, query, "API_KEY");
  const posts = useMemo(() => get(rawData, "data.PostByUpdatedAt.items", []), [rawData]);
  return (
    <div className="blog-container-div">
      <Typography variant="h2">Blogs</Typography>
      <Grid container justifyContent="flex-start">
        {posts.map(post => (
          <Grid item key={post.id} xl={12} xs={12} md={12} sm={12} lg={12} style={{ margin: 12 }}>
            <BlogPostCard
              width="100%"
              post={post}
              showState={false}
              onPostClick={() => {
                history.push(`/blogs/post/${post.id}`);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
