import { Button, Chip, CircularProgress, Paper, Typography } from "@material-ui/core";
import { ArrowBackOutlined } from "@material-ui/icons";
import MarkdownIt from "markdown-it";
import MarkdownItHighlightJSPlugins from "markdown-it-highlightjs";
import htmlParser from "html-react-parser";
import { get, merge } from "lodash";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";

import { getPost } from "../../../graphql/queries";
import { useAWSAPI } from "../../../utils/awsAPI";
import "./index.less";

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */).use(MarkdownItHighlightJSPlugins);

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

  const postContentRawHTML = useMemo(() => mdParser.render(get(post, "data.text", "")), [post]);

  if (loading) {
    return <CircularProgress style={{ margin: "3rem" }} />;
  }

  return (
    <div style={{ margin: "3rem" }}>
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
              <Chip color="primary" label={item} />
            </span>
          ))}
        </div>
      </Paper>

      <Paper
        style={{ padding: "2rem", marginTop: "1rem" }}
        className="post-markdown-content section-container html-wrap"
      >
        {htmlParser(postContentRawHTML)}
      </Paper>
    </div>
  );
}
