import React, { useMemo, useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { Button, Chip, CircularProgress, Paper, TextField, Typography } from "@material-ui/core";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { CheckBoxOutlined } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import { get, isEmpty, merge, trim } from "lodash";
import { useSnackbar } from "notistack";

import "./index.less";
import { uploadPhoto, getPhotoURL } from "../../../utils/awsStorage";
import { useAWSAPI, useLazyAWSAPI } from "../../../utils/awsAPI";
import { getPost } from "../../../graphql/queries";
import { createPost, updatePost } from "../../../graphql/mutations";
import { POST_STATE } from "../../../utils/constants";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function BlogCreation() {
  const history = useHistory();
  const { postID } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const defaultDataInputs = useMemo(() => ({ id: postID }), [postID]);
  const { execute: postPost, loading: postingPost } = useLazyAWSAPI(createPost);
  const { execute: mutatePost, loading: updatingPost } = useLazyAWSAPI(updatePost);
  const { data: rawDefaultData, loading } = useAWSAPI(getPost, defaultDataInputs);
  const defaultData = useMemo(() => {
    const fetchedData = get(rawDefaultData, "data.getPost", {});
    const postData = JSON.parse(get(fetchedData, "data", "{}"));
    return merge({ ...fetchedData, data: postData }, { id: postID });
  }, [rawDefaultData, postID]);
  const [data, setData] = useState(rawDefaultData);

  useEffect(() => {
    setData(defaultData);
  }, [defaultData]);

  const onSubmit = useCallback(async () => {
    try {
      const variables = {
        input: {
          id: get(data, "id"),
          title: get(data, "title"),
          data: JSON.stringify(get(data, "data", {})),
          tags: get(data, "tags"),
          description: get(data, "description"),
          status: POST_STATE.DRAFT,
        },
      };
      isEmpty(get(rawDefaultData, "data.getPost", {})) ? await postPost(variables) : await mutatePost(variables);
      enqueueSnackbar("Post updated", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      history.replace("/blogmanager");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Unable to submit", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }
  }, [enqueueSnackbar, data, mutatePost, postPost, rawDefaultData, history]);

  if (loading) {
    return <CircularProgress style={{ marginTop: 16 }} />;
  }

  return (
    <div className="container-div" style={{ padding: 32 }}>
      <Typography variant="h3">Blog Creation</Typography>
      <Paper style={{ padding: 64, marginTop: 8 }}>
        <TextField
          variant="outlined"
          id="standard-basic"
          label="Post Title"
          fullWidth
          defaultValue={get(data, "title", "")}
          onChange={e => {
            const newTitle = e.target.value;
            setData(currentData => ({ ...currentData, title: newTitle }));
          }}
        />
        <TextField
          variant="outlined"
          id="standard-description"
          label="Post Description"
          fullWidth
          multiline
          defaultValue={get(data, "description", "")}
          style={{ marginTop: 8 }}
          onChange={e => {
            const newDescription = e.target.value;
            setData(currentData => ({ ...currentData, description: newDescription }));
          }}
        />
        <TextField
          variant="outlined"
          id="standard-tags"
          label="Post Tags (Separated by comma)"
          fullWidth
          multiline
          defaultValue={get(data, "tags", []).join(", ")}
          style={{ marginTop: 8 }}
          onChange={e => {
            const newTags = e.target.value;
            setData(currentData => ({
              ...currentData,
              tags: newTags
                .split(",")
                .map(item => trim(item))
                .filter(item => item),
            }));
          }}
        />
        <div style={{ marginTop: 6, textAlign: "left" }}>
          {get(data, "tags", []).map((item, index) => (
            <span style={{ margin: 4 }} key={`${item} ${index}`}>
              <Chip color="primary" label={item} />
            </span>
          ))}
        </div>
        <MdEditor
          style={{ height: "70vh", marginTop: "5rem" }}
          config={{
            markdownClass: "editor-pane",
            imageAccept: ".jpg, .png, .gif",
            allowPasteImage: true,
          }}
          value={get(data, "data.text", "")}
          renderHTML={text => mdParser.render(text)}
          onImageUpload={async file => {
            const prefix = `${postID}-Images/`.replace(/\s+/g, "_");
            const key = `${uuid()}-${get(file, "name", "Image")}`.replace(/\s+/g, "_");
            const { key: uploadedKey } = await uploadPhoto(file, key, prefix);
            return getPhotoURL(uploadedKey, "");
          }}
          onChange={({ text }) => {
            setData(currentData => ({ ...currentData, data: { text } }));
          }}
        />
        {postingPost || updatingPost ? <CircularProgress /> : null}
        <Button
          variant="contained"
          color="primary"
          style={{ width: "60%", marginTop: 8 }}
          startIcon={<CheckBoxOutlined />}
          disabled={postingPost || updatingPost}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Paper>
    </div>
  );
}
