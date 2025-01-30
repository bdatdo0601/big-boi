import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { ResumeProvider } from "@/components/Vitae";

import { useGetFile } from "@/utils/awsStorage";
import { RESUME } from "@/utils/constants";
import { fetchFileToJSON } from "@/utils";
import { ResumeSchema } from "./provider";

const withResumeProvider = <T extends object>(Component: React.FC<T>) => (props: T): React.ReactNode => {
  const { file, loading } = useGetFile(RESUME.SCHEMA_FILE, RESUME.PREFIX);
  const [resume, setResume] = useState<ResumeSchema | null>(null);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then(((jsonFile: ResumeSchema) => setResume(jsonFile)))
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
      <Component {...props} />
    </ResumeProvider>
  );
}

export default withResumeProvider