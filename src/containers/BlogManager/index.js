import React from "react";
import { Button, Paper, Typography } from "@material-ui/core";

import "./index.less";
import { v4 as uuid } from "uuid";
import { AddRounded } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

export default function BlogManager() {
  const history = useHistory();
  return (
    <div className="container-div">
      <Typography variant="h3">Blog Manager</Typography>
      <Paper style={{ marginTop: 12 }}>
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
      </Paper>
    </div>
  );
}
