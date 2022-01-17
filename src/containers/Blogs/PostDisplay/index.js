import { Button, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import { get, merge } from "lodash";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import MarkdownDisplayer from "../../../components/MarkdownDisplayer";
import { getPost } from "../../../graphql/queries";
import { useAWSAPI } from "../../../utils/awsAPI";
import "./index.less";

export default function PostDisplay() {
  const history = useHistory();
  const { postID } = useParams();
  const postDataInputs = useMemo(() => ({ id: postID }), [postID]);
  const { data: rawDefaultData, loading } = useAWSAPI(getPost, postDataInputs, "API_KEY");
  const post = useMemo(() => {
    const fetchedData = get(rawDefaultData, "data.getPost", {});
    const postData = JSON.parse(get(fetchedData, "data", "{}"));
    return merge({ ...fetchedData, data: postData }, { id: postID });
  }, [rawDefaultData, postID]);

  if (loading) {
    return <CircularProgress style={{ margin: "3rem" }} />;
  }

  return (
    <div className="blog-post-container-div" style={{ padding: "3%", width: "100vw" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{get(post, "title", "Blog Post")}</title>
        <link rel="canonical" href={`${window.location.origin}/blogs/post/${postID}`} />
        <meta name="description" content={get(post, "description", "")} />
      </Helmet>
      <Button
        startIcon={<ArrowBackOutlined />}
        color="primary"
        onClick={() => {
          history.replace("/blogs");
        }}
      >
        All Blogs
      </Button>
      <Paper style={{ padding: "2rem", marginTop: "1rem" }}>
        <Typography variant="h4">{get(post, "title", "")}</Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {get(post, "description", "")}
        </Typography>

        <div style={{ marginTop: 8, marginBottom: 8, textAlign: "left" }}>
          {get(post, "tags", []).map((item, index) => (
            <span style={{ marginRight: 8 }} key={`${item} ${index}`}>
              <Chip color="primary" label={item} style={{ marginTop: 8 }} />
            </span>
          ))}
        </div>
      </Paper>

      <Paper style={{ marginTop: 12, marginBottom: "2rem" }} className="post-markdown-content html-wrap">
        <MarkdownDisplayer style={{ padding: "2rem" }} value={get(post, "data.text", "")} />
      </Paper>
    </div>
  );
}
