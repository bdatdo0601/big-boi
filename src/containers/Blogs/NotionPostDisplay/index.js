import { Button, CircularProgress, Paper } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import { get, merge } from "lodash";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { getPost } from "../../../graphql/queries";
import { useAWSAPI } from "../../../utils/awsAPI";
import "./index.less";

export default function NotionPostDisplay() {
  const history = useHistory();
  const { notionPostID } = useParams();
  const postDataInputs = useMemo(() => ({ id: notionPostID }), [notionPostID]);
  const { data: rawDefaultData, loading } = useAWSAPI(getPost, postDataInputs, "API_KEY");
  const post = useMemo(() => {
    const fetchedData = get(rawDefaultData, "data.getPost", {});
    const postData = JSON.parse(get(fetchedData, "data", "{}"));
    return merge({ ...fetchedData, data: postData }, { id: notionPostID });
  }, [rawDefaultData, notionPostID]);

  if (loading) {
    return <CircularProgress style={{ margin: "3rem" }} />;
  }

  return (
    <div style={{ padding: "3%", width: "100vw" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{get(post, "title", "Blog Post")}</title>
        <link rel="canonical" href={`${window.location.origin}/blogs/notion/${notionPostID}`} />
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
      <Paper>
        <link rel="import" href={get(post, "externalLink")} />
      </Paper>
    </div>
  );
}
