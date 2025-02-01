import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { ResumeProvider } from "@/components/Vitae";

import { useGetFile } from "@/utils/awsStorage";
import { RESUME } from "@/utils/constants";
import { ResumeSchema } from "./provider";

export const useStorageResume = () => {
  const { file: rawFile, loading, fetchFile } = useGetFile(RESUME.SCHEMA_FILE, RESUME.PREFIX);
  const [resume, setResume] = useState<ResumeSchema | null>();
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);

  useEffect(() => {
    if (rawFile) {
      rawFile.body.text().then(newResume => {
        setResume(JSON.parse(newResume) as ResumeSchema);
        setFetchLoading(false)
      }).catch(err => {
        console.error(err);
        setResume(null)
        setResume(null)
      });
    }
  }, [rawFile]);


  return { resume, loading: loading && fetchLoading, fetchFile }
}

const withResumeProvider = <T extends object>(Component: React.FC<T>) => (props: T): React.ReactNode => {
  const { resume, loading } = useStorageResume();

  if (loading || !resume) {
    return <div className="w-full *:text-center mx-auto"><CircularProgress /></div>;
  }

  return (
    <ResumeProvider resume={resume}>
      <Component {...props} />
    </ResumeProvider>
  );
}

export default withResumeProvider