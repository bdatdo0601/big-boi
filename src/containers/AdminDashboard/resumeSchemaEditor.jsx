import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { JsonEditor as Editor } from "jsoneditor-react";
import "brace";
import "brace/mode/json";
import "brace/theme/github";
import { CloudUploadOutlined, RestoreOutlined } from "@mui/icons-material";
import { isEqual } from "lodash";

import "./index.css";

import DEFAULT_RESUME from "../../assets/default-resume.json";
import { useGetFile, useUploadFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";
import { useDataUpdateWrapper } from "../../utils/hooks";
import EventType from "../../assets/event-type.json";
import ResumeSchemaForm from "./resumeSchemaForm";

const DataUpdateOptions = {
  snackBar: {
    successMessage: "Resume Data Updated",
    errorMessage: "Unable to Update Resume Data",
  },
  logging: {
    eventType: EventType.Personal.Resume.Update,
  },
};

export default function ResumeSchemaEditor() {
  const { file, loading, fetchFile } = useGetFile(
    RESUME.SCHEMA_FILE,
    RESUME.PREFIX
  );
  const { uploadFile } = useUploadFile();
  const [defaultFile, setDefaultFile] = useState(DEFAULT_RESUME);
  const [resume, setResume] = useState(defaultFile);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then((jsonFile) => setDefaultFile(jsonFile))
        .catch(() => setDefaultFile(DEFAULT_RESUME));
    }
  }, [file]);

  useEffect(() => {
    setResume(defaultFile);
  }, [defaultFile]);

  const updateResume = useCallback(
    async (newResume) => {
      const blob = new Blob([JSON.stringify(newResume)], {
        type: "application/json",
      });
      await uploadFile(blob, RESUME.SCHEMA_FILE, RESUME.PREFIX, "public");
      return newResume;
    },
    [uploadFile]
  );

  const onPostUpdateResume = useCallback(async () => {
    await fetchFile();
  }, [fetchFile]);

  const [onUploadResume] = useDataUpdateWrapper(
    updateResume,
    onPostUpdateResume,
    DataUpdateOptions
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="my-8 mx-16 py-4 px-8 resume-schema-editor w-full bg-card flex flex-col items-center">
      <h5 className="text-3xl mx-auto">Resume Schema Editor</h5>
      <div className="flex flex-row gap-2">
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
      </div>
      <div className="w-full overflow-x-auto">
        <ResumeSchemaForm
          existingResume={resume}
          onUpdateResume={(data) => {
            setResume(data);
          }}
        />
      </div>
    </div>
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
