import AddRounded from '@mui/icons-material/AddRounded';
import { Button, CircularProgress, Typography } from '@mui/material';
import { get, orderBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';
import EventType from '../../assets/event-type.json';
import BlogPostCard from '../../components/BlosPostCard';
import { deletePost as deletePostQuery, updatePost } from '../../graphql/mutations';
import { listPosts } from '../../graphql/queries';
import { useAWSAPI, useLazyAWSAPI } from '../../utils/awsAPI';
import { useDataUpdateWrapper } from '../../utils/hooks';

const DataUpdateOptions = {
  snackBar: {
    successMessage: 'Blog Status Updated',
    errorMessage: 'Unable to Update Blog Post Status',
  },
  logging: {
    eventType: EventType.Personal.BlogPost.StatusUpdate,
  },
};

export default function BlogManager() {
  const navigate = useNavigate();
  const query = useMemo(() => ({ limit: 10000 }), []);
  const { data: rawData, loading, execute: refetch } = useAWSAPI(listPosts, query, 'userPool');
  const { execute: mutatePost, loading: updatingPost } = useLazyAWSAPI(updatePost, 'userPool');
  const { execute: deletePostRequest, loading: deletingPost } = useLazyAWSAPI(deletePostQuery, 'userPool');

  const posts = useMemo(() => get(rawData, 'data.listPosts.items', []), [rawData]);

  const deletePost = useCallback(
    async post => {
      const variables = { input: { id: get(post, 'id') } };
      await deletePostRequest(variables);
      await refetch();
      return variables.input;
    },
    [deletePostRequest, refetch]
  );

  const updateBlogStatusData = useCallback(
    async (post, state) => {
      const variables = { input: { id: get(post, 'id'), status: state } };
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
    <div className="text-center px-4 py-8 h-full">
      <Typography variant="h3">Blog Manager</Typography>
      {loading ? (
        <div className="w-full *:text-center mx-auto my-2">
          <CircularProgress />
        </div>
      ) : null}
      <div style={{ marginTop: 12 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRounded />}
          style={{ width: '60%', margin: 8, maxWidth: 400 }}
          onClick={() => {
            const newID = uuid();
            navigate(`/blogmanager/update/${newID}`);
          }}
        >
          Add New Blog
        </Button>
        <div className="flex flex-wrap gap-12 items-center mt-12 justify-center">
          {orderBy(posts, 'createdAt', 'desc')
            .filter(post => !['Twitter', 'Instagram'].includes(post.postType))
            .map(post => (
              <BlogPostCard
                key={get(post, 'id')}
                post={post}
                updatePostState={updatePostState}
                deletePost={deletePost}
                showActions
                updatingPost={updatingPost}
                deletingPost={deletingPost}
                onPostClick={() => {
                  if (!get(post, 'postType')) {
                    navigate(`/blogmanager/update/${post.id}`);
                    return;
                  }
                  if (
                    get(post, 'externalLink') &&
                    // eslint-disable-next-line
                    window.confirm(`Do you want to navigate to external link: ${get(post, 'postType')}`)
                  ) {
                    window.location.href = get(post, 'externalLink');
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
