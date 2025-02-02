import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { CloudUploadOutlined, CopyAll, RestoreOutlined } from '@mui/icons-material';
import { isEqual, pick } from 'lodash';

import DEFAULT_RESUME from '../../assets/default-resume.json';
import { useGetFile, useUploadFile } from '../../utils/awsStorage';
import { RESUME } from '../../utils/constants';
import { useDataUpdateWrapper } from '../../utils/hooks';
import EventType from '../../assets/event-type.json';
import ResumeSchemaForm from './resumeSchemaForm';
import { useStorageResume } from '@/components/Vitae/withResumeProvider';

const DataUpdateOptions = {
  snackBar: {
    successMessage: 'Resume Data Updated',
    errorMessage: 'Unable to Update Resume Data',
  },
  logging: {
    eventType: EventType.Personal.Resume.Update,
  },
};

export default function ResumeSchemaEditor() {
  const { resume, loading, fetchFile } = useStorageResume();
  const { upload } = useUploadFile();
  const [newResume, setNewResume] = useState(resume);

  useEffect(() => {
    if (resume) {
      setNewResume(resume);
    }
  }, [resume]);

  const updateResume = useCallback(
    async newResume => {
      const blob = new Blob([JSON.stringify(newResume)], {
        type: 'application/json',
      });
      await upload(blob, RESUME.SCHEMA_FILE, RESUME.PREFIX);
      return pick(newResume.basic, ['name', 'email']);
    },
    [upload]
  );

  const onPostUpdateResume = useCallback(async () => {
    await fetchFile();
  }, [fetchFile]);

  const [onUploadResume] = useDataUpdateWrapper(updateResume, onPostUpdateResume, DataUpdateOptions);

  if (loading) {
    return (
      <div className="w-full *:text-center mx-auto">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="my-8 mx-16 py-4 px-8 resume-schema-editor w-full bg-muted flex flex-col items-center">
      <h5 className="text-3xl mx-auto">Resume Schema Editor</h5>
      <div className="flex flex-row gap-2 my-2">
        <button
          className="bg-primary text-white py-1 px-2 rounded-md hover:cursor-pointer disabled:bg-accent"
          disabled={isEqual(resume, newResume)}
          onClick={async () => onUploadResume(newResume)}
        >
          <CloudUploadOutlined /> Update
        </button>
        <button
          className="bg-secondary text-white py-1 px-2 rounded-md hover:cursor-pointer"
          onClick={async () => onUploadResume(DEFAULT_RESUME)}
        >
          <RestoreOutlined /> Reset to Default
        </button>
        <button
          className="bg-secondary text-white py-1 px-2 rounded-md hover:cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(resume, null, 2));
            window.alert("Copied to clipboard")
          }}
        >
          <CopyAll /> Get Current Resume Schema
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <ResumeSchemaForm
          existingResume={newResume || resume}
          onUpdateResume={data => {
            setNewResume(data);
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
