import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { CheckBoxOutlined } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { get } from "lodash";

import "./index.less";
import { uploadPhoto, getPhotoURL } from "../../../utils/awsStorage";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function BlogCreation() {
  const { postID } = useParams();
  const [data, setData] = useState({ id: postID });
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
        <MdEditor
          style={{ height: "70vh", marginTop: 8 }}
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
        <Button
          variant="contained"
          color="primary"
          style={{ width: "60%", marginTop: 8 }}
          startIcon={<CheckBoxOutlined />}
        >
          Submit
        </Button>
      </Paper>
    </div>
  );
}
