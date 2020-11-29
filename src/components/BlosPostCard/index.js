import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Button, Card, CardActionArea, CardActions, CardContent, Chip, Typography } from "@material-ui/core";
import { capitalize, get } from "lodash";

import { POST_STATE } from "../../utils/constants";

export default function BlogPostCard({ post, showActions, updatePostState, updatingPost, onPostClick, showState }) {
  return (
    <Card
      style={{
        width: 350,
        margin: 4,
        textAlign: "left",
        opacity: post.status === POST_STATE.ARCHIVED ? 0.5 : 1,
      }}
      raised
    >
      <CardActionArea onClick={onPostClick}>
        <CardContent>
          {showState && (
            <Typography color="textSecondary" gutterBottom>
              {capitalize(post.status)}
            </Typography>
          )}
          <Typography gutterBottom variant="h5" component="h2">
            {post.title}
          </Typography>
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
          <Typography variant="body2" color="textSecondary" component="p">
            Updated At: {moment(post.updatedAt).format("hh:mma MMM DD YYYY")}
          </Typography>
        </CardContent>
      </CardActionArea>
      {showActions && (
        <CardActions>
          <Button
            size="small"
            disabled={updatingPost}
            onClick={() => {
              updatePostState(post, POST_STATE.DRAFT);
            }}
          >
            Draft
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={updatingPost}
            onClick={() => {
              updatePostState(post, POST_STATE.PUBLISHED);
            }}
          >
            Publish
          </Button>
          <Button
            size="small"
            color="secondary"
            disabled={updatingPost}
            onClick={() => {
              updatePostState(post, POST_STATE.ARCHIVED);
            }}
          >
            Archived
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  updatePostState: PropTypes.func,
  showActions: PropTypes.bool,
  updatingPost: PropTypes.bool,
  onPostClick: PropTypes.func,
  showState: PropTypes.bool,
};

BlogPostCard.defaultProps = {
  updatePostState: () => {},
  showActions: false,
  updatingPost: false,
  onPostClick: () => {},
  showState: true,
};
