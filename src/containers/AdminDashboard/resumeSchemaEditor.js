import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { JsonEditor as Editor } from "jsoneditor-react";
import { CloudUploadOutlined, RestoreOutlined } from "@material-ui/icons";
import "jsoneditor-react/es/editor.min.css";
import { isEqual } from "lodash";
import { useSnackbar } from "notistack";

import "./index.less";

import DEFAULT_RESUME from "../../assets/default-resume.json";
import { useGetFile, useUploadFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";

export default function ResumeSchemaEditor() {
  const { enqueueSnackbar } = useSnackbar();
  const { file, loading, fetchFile } = useGetFile(RESUME.SCHEMA_FILE, RESUME.PREFIX);
  const { uploadFile } = useUploadFile();
  const [defaultFile, setDefaultFile] = useState(DEFAULT_RESUME);
  const [resume, setResume] = useState(defaultFile);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then(jsonFile => setDefaultFile(jsonFile))
        .catch(() => setDefaultFile(DEFAULT_RESUME));
    }
  }, [file]);

  useEffect(() => {
    setResume(defaultFile);
  }, [defaultFile]);

  const onUploadResume = useCallback(
    async newResume => {
      try {
        const blob = new Blob([JSON.stringify(newResume)], { type: "application/json" });
        await uploadFile(blob, RESUME.SCHEMA_FILE, RESUME.PREFIX, "public");
        await fetchFile();
        enqueueSnackbar("Resume Updated", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      } catch (err) {
        enqueueSnackbar(`Can't Updated Resume ${err.message}`, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    },
    [enqueueSnackbar, fetchFile, uploadFile]
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card className="my-8 mx-16 py-4 px-8 resume-schema-editor">
      <Typography variant="h5">Resume Schema Editor</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadOutlined />}
        disabled={isEqual(resume, defaultFile)}
        onClick={async () => onUploadResume(resume)}
        style={{ margin: 12 }}
      >
        Update
      </Button>
      <Button
        variant="contained"
        startIcon={<RestoreOutlined />}
        onClick={async () => onUploadResume(DEFAULT_RESUME)}
        style={{ margin: 12 }}
      >
        Reset to Default
      </Button>
      <Editor
        value={resume}
        onChange={newJSONFile => {
          setResume(newJSONFile);
        }}
      />
    </Card>
  );
}

ResumeSchemaEditor.propTypes = {
  fetchFiles: PropTypes.func,
  uploadFile: PropTypes.func,
  deleteFile: PropTypes.func,
};

ResumeSchemaEditor.defaultProps = {
  fetchFiles: async () => [],
  uploadFile: async () => {},
  deleteFile: async () => {},
};
