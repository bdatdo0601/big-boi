import React, { useMemo } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { useAWSAPI } from "../../utils/awsAPI";
import { postByUpdatedAt } from "../../graphql/queries";
import { POST_STATE } from "../../utils/constants";
import BlogPostCard from "../../components/BlosPostCard";
import "./index.less";

const BlogPostSource = {
  NOTION: "notion",
};

export default function Blogs() {
  const query = useMemo(() => ({ status: POST_STATE.PUBLISHED, sortDirection: "DESC", limit: 10000 }), []);
  const history = useHistory();
  const { data: rawData } = useAWSAPI(postByUpdatedAt, query, "API_KEY");
  const posts = useMemo(() => get(rawData, "data.PostByUpdatedAt.items", []), [rawData]);
  return (
    <div className="blog-container-div">
      <Typography variant="h2">Blogs</Typography>
      <Paper style={{ height: "100%", maxWidth: 1100, padding: 24, marginTop: 12, overflow: "auto" }} elevation={1}>
        <Grid container justifyContent="center" alignItems="center" alignContent="center">
          {posts.map(post => (
            <Grid item key={get(post, "id")} xl={12} xs={12} md={12} sm={12} lg={12} style={{ margin: 12 }}>
              <BlogPostCard
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
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
}
