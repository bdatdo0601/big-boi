import React, { useCallback, useMemo } from "react";
import { Button, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import { get } from "lodash";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import { AddRounded } from "@mui/icons-material";
import Masonry from "react-masonry-css";

import { useAWSAPI, useLazyAWSAPI } from "../../utils/awsAPI";
import { listPosts } from "../../graphql/queries";
import "./index.less";
import { updatePost, deletePost as deletePostQuery } from "../../graphql/mutations";
import BlogPostCard from "../../components/BlosPostCard";
import { useDataUpdateWrapper } from "../../utils/hooks";
import EventType from "../../assets/event-type.json";

const DataUpdateOptions = {
  snackBar: {
    successMessage: "Blog Status Updated",
    errorMessage: "Unable to Update Blog Post Status",
  },
  logging: {
    eventType: EventType.Personal.BlogPost.StatusUpdate,
  },
};

export default function BlogManager() {
  const history = useHistory();
  const query = useMemo(() => ({ limit: 10000 }), []);
  const isWeb = useMediaQuery("(min-width:1200px)");
  const { data: rawData, loading, execute: refetch } = useAWSAPI(listPosts, query, "AWS_IAM");
  const { execute: mutatePost, loading: updatingPost } = useLazyAWSAPI(updatePost, "AWS_IAM");
  const { execute: deletePostRequest, loading: deletingPost } = useLazyAWSAPI(deletePostQuery, "AWS_IAM");

  const posts = useMemo(() => get(rawData, "data.listPosts.items", []), [rawData]);

  const deletePost = useCallback(
    async post => {
      const variables = { input: { id: get(post, "id") } };
      await deletePostRequest(variables);
      await refetch();
      return variables.input;
    },
    [deletePostRequest, refetch]
  );

  const updateBlogStatusData = useCallback(
    async (post, state) => {
      const variables = { input: { id: get(post, "id"), status: state } };
      await mutatePost(variables);
      return variables.input;
    },
    [mutatePost]
  );

  const onPostUpdateBlogStatusData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const [updatePostState] = useDataUpdateWrapper(updateBlogStatusData, onPostUpdateBlogStatusData, DataUpdateOptions);

  return (
    <div className="blog-manager-container-div text-center px-4 py-8">
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
        <Masonry
          breakpointCols={isWeb ? 3 : 1}
          className="masonry-blog-manager"
          columnClassName="masonry-blog-column-manager"
        >
          {posts.map(post => (
            <BlogPostCard
              post={post}
              updatePostState={updatePostState}
              deletePost={deletePost}
              showActions
              updatingPost={updatingPost}
              deletingPost={deletingPost}
              onPostClick={() => {
                if (!get(post, "postType")) {
                  history.push(`/blogmanager/update/${post.id}`);
                  return;
                }
                if (
                  get(post, "externalLink") &&
                  // eslint-disable-next-line
                  window.confirm(`Do you want to navigate to external link: ${get(post, "postType")}`)
                ) {
                  window.location.href = get(post, "externalLink");
                }
              }}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
}
