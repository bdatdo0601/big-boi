import React, { useContext, useMemo } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Button, Card, CardActionArea, CardActions, CardContent, Chip, Typography, Divider } from "@mui/material";
import { capitalize, get } from "lodash";
import { Tweet } from "react-twitter-widgets";

import { POST_STATE } from "../../utils/constants";
import "./index.less";
import LayoutContext from "../../context/layout";

const DefaultCardContent = ({ post, showState, onPostClick, width, isDark }) => (
  <Card
    style={{
      width,
      maxWidth: 550,
      margin: "12px auto",
      textAlign: "left",
      opacity: post.status === POST_STATE.ARCHIVED ? 0.5 : 1,
      borderRadius: "10px",
    }}
    raised
    elevation={3}
  >
    <CardActionArea onClick={onPostClick}>
      <CardContent style={{ backgroundColor: isDark ? "rgb(0, 0, 0)" : "rgb(255,255,255)", padding: 20 }}>
        {showState && (
          <Typography color="textSecondary" gutterBottom>
            {`${get(post, "postType") ? `[${capitalize(get(post, "postType"))}] ` : ""}${capitalize(post.status)}`}
          </Typography>
        )}
        <Typography gutterBottom variant="h5" component="h2">
          {post.title}
        </Typography>
        <Divider style={{ marginBottom: 10 }} />
        <Typography variant="body2" color="textSecondary" component="p">
          {post.description}
        </Typography>
        <div style={{ marginTop: 12, marginBottom: 12, textAlign: "left" }}>
          {get(post, "tags", []).map((item, index) => (
            <span style={{ marginRight: 8, marginTop: 4 }} key={`${item} ${index}`}>
              <Chip color="primary" label={item} style={{ marginTop: 8 }} />
            </span>
          ))}
        </div>
        <Divider style={{ marginBottom: 10 }} />
        <Typography variant="body2" color="textSecondary" component="p">
          Updated At: {moment(post.updatedAt).format("hh:mma MMM DD YYYY")}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

DefaultCardContent.propTypes = {
  post: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  showState: PropTypes.bool,
  onPostClick: PropTypes.func,
  width: PropTypes.number,
};

DefaultCardContent.defaultProps = {
  showState: false,
  onPostClick: () => {},
  width: 600,
};

const TwitterCardContent = ({ post, isDark }) => {
  const postData = useMemo(() => JSON.parse(get(post, "data", "{}")), [post]);
  return (
    <div className="tweet-wrapper" style={{ margin: 8 }}>
      <Tweet tweetId={get(postData, "tweetID")} options={{ theme: isDark ? "dark" : "light", align: "center" }} />
    </div>
  );
};

TwitterCardContent.propTypes = {
  post: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const CardContentData = ({ post, ...props }) => {
  switch (get(post, "postType")) {
    case "Twitter":
      return <TwitterCardContent post={post} {...props} />;
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
    <>
      <CardContentData post={post} showState={showState} onPostClick={onPostClick} width={width} isDark={isDark} />
      {showActions && (
        <CardActions>
          <Button
            size="small"
            disabled={updatingPost || get(post, "postType")}
            onClick={() => {
              updatePostState(post, POST_STATE.DRAFT);
            }}
          >
            Draft
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={updatingPost || get(post, "postType")}
            onClick={() => {
              updatePostState(post, POST_STATE.PUBLISHED);
            }}
          >
            Publish
          </Button>
          <Button
            size="small"
            color="warning"
            disabled={updatingPost || get(post, "postType")}
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
              if (window.confirm("Are you sure?")) {
                deletePost(post);
              }
            }}
          >
            Delete
          </Button>
        </CardActions>
      )}
    </>
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
  updatePostState: () => {},
  showActions: false,
  deletePost: () => {},
  deletingPost: false,
  updatingPost: false,
  onPostClick: () => {},
  showState: true,
};
