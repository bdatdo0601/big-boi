import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { ResumeProvider } from "react-vitae";

import DEFAULT_RESUME from "../../assets/default-resume.json";
import ResumeDisplay from "./ResumeDisplay";

export default function Background() {
  return (
    <div className="container-div">
      <Typography variant="h3">Background</Typography>
      <Paper style={{ margin: "2rem", padding: 12 }}>
        <ResumeProvider resume={DEFAULT_RESUME}>
          <ResumeDisplay />
        </ResumeProvider>
      </Paper>
    </div>
  );
}
