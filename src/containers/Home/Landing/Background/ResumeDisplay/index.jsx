import {
  Avatar,
  Card,
  Chip,
  Grid,
  Link,
  Step,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Facebook from "@mui/icons-material/Facebook";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Twitter from "@mui/icons-material/Twitter";
import get from "lodash/get";
import React from "react";
import {
  useBasic,
  useEducation,
  useSkills,
  useLanguages,
  useWork,
  useProjects,
  useVolunteer,
  useInterests,
} from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";
import { BasicInfo } from "./BasicInfo";
import { Education } from "./Education";
import { Competencies } from "./Competencies";
import Experiences from "./Experiences";
import Projects from "./Projects";
import Volunteer from "./Volunteers";
import Interests from "./Interests";

const ResumeDisplay = () => (
  <div className="w-full flex flex-wrap max-md:gap-8">
    <div className="w-full min-lg:w-1/3 p-2">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <BasicInfo />
        </div>
        <div className="w-full">
          <Education />
        </div>
        <div className="w-full">
          <Competencies />
        </div>
        <div className="w-full">
          <Projects />
        </div>
        <div className="w-full">
          <Interests />
        </div>
      </div>
    </div>

    <div className="w-full min-lg:w-2/3 p-2">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <div className="page-break" />
          <Experiences />
        </div>
        <div className="w-full">
          <div className="page-break" />
          <Volunteer />
        </div>
      </div>
    </div>
  </div>
);

export default ResumeDisplay;
