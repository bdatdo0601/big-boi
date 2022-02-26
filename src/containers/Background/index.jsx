import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { ResumeProvider } from "../../components/Vitae";

import ResumeDisplay from "./ResumeDisplay";
import { useGetFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";
import "./index.less";

export default function Background() {
  const targetRef = useRef(null);
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
      <Typography variant="h3">Background</Typography>
      {/* <ReactToPrint content={() => targetRef.current} documentTitle={`${moment().format("MMDDYYYY")}_DatDoResume`}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button onClick={handlePrint} variant="contained" color="primary" style={{ marginTop: 12, marginRight: 8 }}>
              Generate Resume
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint> */}
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
      <Paper className="resume-preview" style={{ margin: "3%", padding: 12 }}>
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
