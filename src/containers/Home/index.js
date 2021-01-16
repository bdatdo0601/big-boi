import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { get } from "lodash";
import Landing from "./Landing";
import About from "./About";
import { useGetFile } from "../../utils/awsStorage";
import { RESUME } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";

export default function Home() {
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="container-div">
      <Landing
        keywords={get(resume, "custom.keywordTags", [])}
        contacts={get(resume, "custom.contacts", [])}
        bio={get(resume, "custom.bio", [])}
      />
      <About resume={resume} />
    </div>
  );
}
