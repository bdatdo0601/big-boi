import React, { useCallback, useMemo } from "react";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { get } from "lodash";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import { AddRounded } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import { useAWSAPI, useLazyAWSAPI } from "../../utils/awsAPI";
import { listPosts } from "../../graphql/queries";
import "./index.less";
import { updatePost } from "../../graphql/mutations";
import BlogPostCard from "../../components/BlosPostCard";

export default function BlogManager() {
  const history = useHistory();
  const query = useMemo(() => ({ limit: 10000 }), []);
  const { data: rawData, loading, execute: refetch } = useAWSAPI(listPosts, query);
  const { execute: mutatePost, loading: updatingPost } = useLazyAWSAPI(updatePost);
  const { enqueueSnackbar } = useSnackbar();

  const posts = useMemo(() => get(rawData, "data.listPosts.items", []), [rawData]);

  const updatePostState = useCallback(
    async (post, state) => {
      try {
        const variables = { input: { id: get(post, "id"), status: state } };
        await mutatePost(variables);
        enqueueSnackbar("Post updated", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        await refetch();
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Unable to update", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    },
    [enqueueSnackbar, mutatePost, refetch]
  );

  return (
    <div className="blog-container-div text-center px-4 py-8">
      <Typography variant="h3">Blog Manager</Typography>
      {loading ? <CircularProgress /> : null}
      <div style={{ marginTop: 12 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRounded />}
          style={{ width: "60%", margin: 8 }}
          onClick={() => {
            const newID = uuid();
            history.push(`/blogmanager/update/${newID}`);
          }}
        >
          Add New Blog
        </Button>
        <Grid container justify="flex-start">
          {posts.map(post => (
            <Grid item key={post.id} style={{ margin: 8 }}>
              <BlogPostCard
                post={post}
                updatePostState={updatePostState}
                showActions
                updatingPost={updatingPost}
                onPostClick={() => {
                  history.push(`/blogmanager/update/${post.id}`);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
