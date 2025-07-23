import { Button, Card, CardActionArea, CardActions, CardContent, Chip, Divider, Typography } from '@mui/material';
import { capitalize, get, isString } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import { Tweet } from 'react-twitter-widgets';
import LayoutContext from '../../context/layout';
import { POST_STATE } from '../../utils/constants';
import ProfileCard from '../ProfileCard';

const DefaultCardContent = ({ post, onPostClick }) => (
  <div className={`w-full text-left ${post.status === POST_STATE.ARCHIVED ? 'opacity-50' : 'opacity-100'}`}>
    <div className="cursor-pointer" onClick={onPostClick}>
      <div className="text-input p-5">
        <p className="text-input mb-3">{post.description}</p>
        <div className="mb-3 text-left">
          {get(post, 'tags', []).map((item, index) => (
            <span className="mr-2 mt-1 inline-block" key={`${item} ${index}`}>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm mt-2">{item}</span>
            </span>
          ))}
        </div>
        <p className="text-input text-sm">Updated At: {moment(post.updatedAt).format('hh:mma MMM DD YYYY')}</p>
        <p className="text-input text-xs mb-2">
          {`Status: ${
            get(post, 'postType') ? `[${capitalize(get(post, 'postType'))}] ` : ''
          }${capitalize(post.status)}`}
        </p>
      </div>
    </div>
  </div>
);

DefaultCardContent.propTypes = {
  post: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  showState: PropTypes.bool,
  onPostClick: PropTypes.func,
  width: PropTypes.any,
};

DefaultCardContent.defaultProps = {
  showState: false,
  onPostClick: () => {
    /* test */
  },
  width: 600,
};

const TwitterCardContent = ({ post, isDark }) => {
  const postData = useMemo(() => JSON.parse(get(post, 'data', '{}')), [post]);
  return (
    <div className="tweet-wrapper" style={{ margin: 8, padding: 8 }}>
      <Tweet tweetId={get(postData, 'tweetID')} options={{ theme: isDark ? 'dark' : 'light', align: 'center' }} />
    </div>
  );
};

TwitterCardContent.propTypes = {
  post: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const InstgramCardContent = ({ post, width }) => {
  const postData = useMemo(() => JSON.parse(get(post, 'data', '{}')), [post]);
  return (
    <Card
      style={{
        width,
        maxWidth: 550,
        margin: '12px auto',
        textAlign: 'left',
        opacity: post.status === POST_STATE.ARCHIVED ? 0.5 : 1,
        borderRadius: '10px',
        padding: 16,
      }}
      raised
      elevation={3}
    >
      <InstagramEmbed url={get(postData, 'link')} />
      <Divider style={{ marginBottom: 10 }} />
      <Typography variant="body" color="textSecondary" component="p" style={{ marginBottom: 10 }}>
        {postData.text}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        Updated At: {moment(postData.updatedAt).format('hh:mma MMM DD YYYY')}
      </Typography>
    </Card>
  );
};

InstgramCardContent.propTypes = {
  post: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const CardContentData = ({ post, ...props }) => {
  switch (get(post, 'postType')) {
    case 'Twitter':
      return <TwitterCardContent post={post} {...props} />;
    case 'Instagram':
      return <InstgramCardContent post={post} {...props} />;
    default:
      return <DefaultCardContent post={post} {...props} />;
  }
};

CardContentData.propTypes = {
  post: PropTypes.object.isRequired,
};

CardContentData.defaultProps = {};

export default function BlogPostCard({
  post,
  showActions,
  updatePostState,
  updatingPost,
  onPostClick,
  showState,
  width,
  deletePost,
  deletingPost,
}) {
  const { isDark } = useContext(LayoutContext);
  return (
    <ProfileCard
      header={
        <h3 className="text-2xl px-2 hover:cursor-pointer" onClick={onPostClick}>
          {post.title}
        </h3>
      }
      cardStyle={{ maxWidth: 600 }}
    >
      <CardContentData post={post} showState={showState} onPostClick={onPostClick} width={width} isDark={isDark} />
      {showActions && (
        <span className="flex flex-row justify-center gap-4 mt-2">
          <Button
            size="small"
            disabled={isString(get(updatingPost || post, 'postType'))}
            onClick={() => {
              updatePostState(post, POST_STATE.DRAFT);
            }}
          >
            Draft
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={isString(get(updatingPost || post, 'postType'))}
            onClick={() => {
              updatePostState(post, POST_STATE.PUBLISHED);
            }}
          >
            Publish
          </Button>
          <Button
            size="small"
            color="warning"
            disabled={isString(get(updatingPost || post, 'postType'))}
            onClick={() => {
              updatePostState(post, POST_STATE.ARCHIVED);
            }}
          >
            Archived
          </Button>
          <Button
            size="small"
            color="error"
            disabled={deletingPost}
            onClick={() => {
              // eslint-disable-next-line
              if (window.confirm('Are you sure?')) {
                deletePost(post);
              }
            }}
          >
            Delete
          </Button>
        </span>
      )}
    </ProfileCard>
  );
}

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  updatePostState: PropTypes.func,
  showActions: PropTypes.bool,
  updatingPost: PropTypes.bool,
  onPostClick: PropTypes.func,
  deletePost: PropTypes.func,
  deletingPost: PropTypes.bool,
  showState: PropTypes.bool,
  width: PropTypes.any,
};

BlogPostCard.defaultProps = {
  width: 350,
  updatePostState: () => {
    /** */
  },
  showActions: false,
  deletePost: () => {
    /** */
  },
  deletingPost: false,
  updatingPost: false,
  onPostClick: () => {
    /** */
  },
  showState: true,
};
