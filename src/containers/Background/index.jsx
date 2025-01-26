import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { ResumeProvider } from "../../components/Vitae";

import ResumeDisplay from "./ResumeDisplay";
import { useGetFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";
import ProfileCard from "../../components/ProfileCard";

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
    <div className="mx-auto flex flex-col items-center">
      <ProfileCard
        header={
          <Typography className="text-primary" variant="h4">
            Background
          </Typography>
        }
        contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
        animation={false}
        cardStyle={{
          maxWidth: 600,
          width: "100%",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        <div className="mx-4 my-2" style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              window.location.href = `${window.location.protocol}//${window.location.host}/custom/resume.pdf`;
            }}
            variant="contained"
            color="primary"
            style={{ marginTop: 12, marginLeft: 8 }}
          >
            Get Custom Resume
          </Button>
        </div>
      </ProfileCard>
      <div className="mx-16 rounded-lg bg-foreground p-3">
        <div
          ref={(ref) => {
            targetRef.current = ref;
          }}
        >
          <ResumeProvider resume={resume}>
            <ResumeDisplay />
          </ResumeProvider>
        </div>
      </div>
    </div>
  );
}
