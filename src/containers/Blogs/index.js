import React, { useMemo } from "react";
import { Grid, Typography } from "@material-ui/core";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { useAWSAPI } from "../../utils/awsAPI";
import { listPosts } from "../../graphql/queries";
import { POST_STATE } from "../../utils/constants";
import BlogPostCard from "../../components/BlosPostCard";

export default function Blogs() {
  const query = useMemo(() => ({ filter: { status: { eq: POST_STATE.PUBLISHED } }, limit: 1000 }), []);
  const history = useHistory();
  const { data: rawData } = useAWSAPI(listPosts, query, "API_KEY");
  const posts = useMemo(() => get(rawData, "data.listPosts.items", []), [rawData]);
  return (
    <div className="container-div">
      <Typography variant="h2">Blogs</Typography>
      <Grid container justify="space-around">
        {posts.map(post => (
          <Grid item key={post.id}>
            <BlogPostCard
              post={post}
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
