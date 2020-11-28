import React, { useMemo } from "react";
import { Grid, Typography } from "@material-ui/core";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { useAWSAPI } from "../../utils/awsAPI";
import { postByUpdatedAt } from "../../graphql/queries";
import { POST_STATE } from "../../utils/constants";
import BlogPostCard from "../../components/BlosPostCard";

export default function Blogs() {
  const query = useMemo(() => ({ status: POST_STATE.PUBLISHED, sortDirection: "DESC", limit: 10000 }), []);
  const history = useHistory();
  const { data: rawData } = useAWSAPI(postByUpdatedAt, query, "API_KEY");
  const posts = useMemo(() => get(rawData, "data.PostByUpdatedAt.items", []), [rawData]);
  return (
    <div className="container-div">
      <Typography variant="h2">Blogs</Typography>
      <Grid container justify="flex-start" style={{ margin: 12 }}>
        {posts.map(post => (
          <Grid item key={post.id} style={{ marginLeft: 16 }}>
            <BlogPostCard
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
