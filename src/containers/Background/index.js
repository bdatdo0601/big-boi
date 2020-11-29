import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Paper, Typography } from "@material-ui/core";
import { ResumeProvider } from "react-vitae";
import moment from "moment";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

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
      <ReactToPrint content={() => targetRef.current} documentTitle={`${moment().format("MMDDYYYY")}_DatDoResume`}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button onClick={handlePrint} variant="contained" color="primary">
              Generate Resume
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <Paper
        className="resume-preview"
        style={{ margin: "2rem", padding: 12 }}
        ref={ref => {
          targetRef.current = ref;
        }}
      >
        <ResumeProvider resume={resume}>
          <ResumeDisplay />
        </ResumeProvider>
      </Paper>
    </div>
  );
}
