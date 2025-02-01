import React, { useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
import { ResumeProvider } from "../../../../components/Vitae";

import ResumeDisplay from "./ResumeDisplay";
import { useGetFile } from "../../../../utils/awsStorage";
import { RESUME } from "../../../../utils/constants";
import ProfileCard from "../../../../components/ProfileCard";
import withResumeProvider from "@/components/Vitae/withResumeProvider";

const Background = () => {
  return (
    <div className="mx-auto flex flex-col items-center">
      <ResumeDisplay />
    </div>
  );
};

export default withResumeProvider(Background);
