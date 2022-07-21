import React, { useEffect, useRef, useState, useContext } from "react";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { ResumeProvider } from "../../components/Vitae";

import ResumeDisplay from "./ResumeDisplay";
import { useGetFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";
import "./index.less";
import ProfileCard from "../../components/ProfileCard";
import LayoutContext from "../../context/layout";

export default function Background() {
  const targetRef = useRef(null);
  const { globalAnimation } = useContext(LayoutContext);
  const { file, loading } = useGetFile(RESUME.SCHEMA_FILE, RESUME.PREFIX);
  const [resume, setResume] = useState(null);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then(jsonFile => setResume(jsonFile))
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
    <div className="container-div">
      <ProfileCard
        header={<Typography variant="h4">Background</Typography>}
        contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
        animation={false}
        cardStyle={{ maxWidth: 600, width: "100%", marginTop: 24, marginBottom: 12 }}
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
      <Paper className="resume-preview" style={{ marginTop: 12, padding: 12 }}>
        <div
          className="resume-wrapper"
          ref={ref => {
            targetRef.current = ref;
          }}
        >
          <ResumeProvider resume={resume}>
            <ResumeDisplay />
          </ResumeProvider>
        </div>
      </Paper>
    </div>
  );
}
