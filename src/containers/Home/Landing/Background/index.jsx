import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { ResumeProvider } from "../../../../components/Vitae";

import ResumeDisplay from "./ResumeDisplay";
import { useGetFile } from "../../../../utils/awsStorage";
import { RESUME } from "../../../../utils/constants";
import { fetchFileToJSON } from "../../../../utils";
import ProfileCard from "../../../../components/ProfileCard";

export default function Background() {
  const targetRef = useRef(null);
  const { file, loading } = useGetFile(RESUME.SCHEMA_FILE, RESUME.PREFIX);
  const [resume, setResume] = useState(null);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then((jsonFile) => setResume(jsonFile))
        .catch(() => setResume(null));
    }
  }, [file]);

  useEffect(() => {
    setResume(resume);
  }, [resume]);

  if (loading || !resume) {
    return <CircularProgress />;
  }

  return (
    <ResumeProvider resume={resume}>
      <div
        className="mx-auto flex flex-col items-center"
        ref={(ref) => {
          targetRef.current = ref;
        }}
      >
        <ResumeDisplay />
      </div>
    </ResumeProvider>
  );
}
