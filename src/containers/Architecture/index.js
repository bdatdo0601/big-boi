import React, { useMemo } from "react";
import { Paper } from "@mui/material";

import "./index.less";
import useGetTextFileFromURL from "../../utils/hooks/useFetchTextFromURL";
import MarkdownDisplayer from "../../components/MarkdownDisplayer";

const ARCHITECTURE_ROOTURL = "https://raw.githubusercontent.com/bdatdo0601/big-boi/develop/docs/architecture/index.md";

const GITHUB_ROOTURL = "https://raw.githubusercontent.com/bdatdo0601/big-boi/develop";

// ![PersonalWebsiteArchitecture](/docs/architecture/DD_PersonalWebsiteArchitecture.png)

export default function ChangeLogs() {
  const { text } = useGetTextFileFromURL(ARCHITECTURE_ROOTURL);

  const formattedText = useMemo(() => {
    const relativeLinks = text.match(/\(\/.*\)/g);
    let result = text;
    if (relativeLinks) {
      relativeLinks.forEach(val => {
        const formattedVal = val.replace(/[)(]/g, "");
        result = result.replace(formattedVal, `${GITHUB_ROOTURL}${formattedVal}`);
      });
    }
    return result;
  }, [text]);

  return (
    <Paper style={{ margin: "3%" }} className="section-container html-wrap">
      <MarkdownDisplayer value={formattedText} style={{ padding: "2rem", marginTop: "1rem" }} />
    </Paper>
  );
}
