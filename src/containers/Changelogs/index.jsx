import React from "react";
import { Paper } from "@mui/material";

import "./index.less";
import useGetTextFileFromURL from "../../utils/hooks/useFetchTextFromURL";
import MarkdownDisplayer from "../../components/MarkdownDisplayer";

const CHANGELOG_URL = "https://raw.githubusercontent.com/bdatdo0601/big-boi/develop/CHANGELOG.md";

export default function ChangeLogs() {
  const { text } = useGetTextFileFromURL(CHANGELOG_URL);

  return (
    <Paper className="section-container html-wrap">
      <MarkdownDisplayer value={text} style={{ padding: "4rem", overflowWrap: "break-word" }} />
    </Paper>
  );
}
