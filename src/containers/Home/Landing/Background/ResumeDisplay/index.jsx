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
import { Facebook, GitHub, LinkedIn, Twitter } from "@mui/icons-material";
import { get } from "lodash";
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

const IconMapper = {
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
  Twitter: <Twitter />,
  GitHub: <GitHub />,
};

const BasicInfo = () => {
  const basicInfo = useBasic();
  return (
    <div className="text-input bg-card w-full px-4 py-2 rounded-lg">
      <h1 className="text-xl font-medium text-input">
        {get(basicInfo, "name")}
      </h1>
      <h2 className="text-base font-normal text-input">
        {get(basicInfo, "label")}
      </h2>
      {/* <p className="text-sm font-normal text-input mb-2">
        <a className="text-input" href={get(basicInfo, "website")}>
          {get(basicInfo, "website")}
        </a>
        {" | "}
        <a className="text-input" href={`tel:${get(basicInfo, "phone")}`}>
          {get(basicInfo, "phone")}
        </a>
        {" | "}
        <a className="text-input" href={`mailto:${get(basicInfo, "email")}`}>
          {get(basicInfo, "email")}
        </a>
        {" | "}
        {`${get(basicInfo, "location.city")} ${get(
          basicInfo,
          "location.postalCode"
        )}`}
      </p>
      {get(basicInfo, "profiles", []).map((item) => (
        <Chip
          key={item.network}
          icon={
            <span style={{ color: "var(--input)" }}>
              {IconMapper[item.network]}
            </span>
          }
          label={item.username}
          style={{ margin: 6, color: "var(--input)" }}
          onClick={() => {
            window.location.href = item.url;
          }}
        />
      ))} */}
      <p className="text-base font-normal text-justify mt-2">
        {get(basicInfo, "summary")}
      </p>
    </div>
  );
};

const Education = () => {
  const educations = useEducation();
  return (
    <Card
      style={{
        marginTop: 8,
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
      elevation={3}
    >
      <Typography variant="h5">Education</Typography>
      <Stepper orientation="vertical" style={{ textAlign: "left" }} nonLinear>
        {educations.map((item) => (
          <Step key={item.institution}>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar style={{ width: 70, height: 70 }}>
                  {item.institution[0] || ""}
                </Avatar>
              }
            >
              <Typography className="text-input" variant="h6">
                {item.institution}
              </Typography>
              <Typography className="text-input" variant="subtitle1">
                {item.studyType}: {item.area} (GPA: {item.gpa})
              </Typography>
              <Typography className="text-input" variant="subtitle2">
                {item.startDate} - {item.endDate}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Card>
  );
};

const Competencies = () => {
  const skills = useSkills();
  const languages = useLanguages();
  return (
    <Card
      style={{
        marginTop: 8,
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
      elevation={3}
    >
      <Typography variant="h5">Competencies</Typography>
      {skills.map((skillset) => (
        <div
          key={skillset.name}
          style={{
            textAlign: "left",
            paddingLeft: 8,
            borderLeft: "4px solid green",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography variant="body1">
            {skillset.name} ({skillset.level})
          </Typography>
          {get(skillset, "keywords", []).map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              style={{ marginRight: 6, marginTop: 4, color: "var(--input)" }}
              size="small"
            />
          ))}
        </div>
      ))}
      <div
        style={{
          textAlign: "left",
          paddingLeft: 8,
          borderLeft: "4px solid green",
          marginTop: 6,
          marginBottom: 6,
        }}
      >
        <Typography variant="body1">Languages</Typography>
        {languages.map((language) => (
          <Chip
            key={language.language}
            label={`${language.language} (${language.fluency})`}
            style={{ marginRight: 6, marginTop: 4, color: "var(--input)" }}
            size="small"
          />
        ))}
      </div>
    </Card>
  );
};

const Experiences = () => {
  const experiences = useWork();
  return (
    <Card
      elevation={3}
      style={{
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
    >
      <Typography variant="h5">Experiences</Typography>
      <Stepper orientation="vertical" style={{ textAlign: "left" }} nonLinear>
        {experiences.map((item) => (
          <Step key={item.company + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar style={{ width: 50, height: 50 }}>
                  {item.company[0] || ""}
                </Avatar>
              }
            >
              <Typography className="text-input" variant="h6">
                {item.company}
              </Typography>
              <Typography className="text-input" variant="subtitle1">
                {item.position}
              </Typography>
              <Typography className="text-input" variant="subtitle2">
                {item.startDate} - {item.endDate}
              </Typography>
              <Typography className="text-input" variant="subtitle2">
                {item.summary} {item.website && `| ${item.website}`}
              </Typography>
            </StepLabel>
            <StepContent>
              {item.highlights.map((highlight) => (
                <Typography variant="body1" key={highlight}>
                  &#8226; {highlight}
                </Typography>
              ))}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Card>
  );
};
const Projects = () => {
  const projects = useProjects();
  return (
    <Card
      elevation={3}
      style={{
        marginTop: 8,
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
    >
      <Typography variant="h5">Projects</Typography>
      {projects.map((project) => (
        <div
          key={project.name}
          style={{
            textAlign: "left",
            paddingLeft: 8,
            borderLeft: "4px solid orange",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography className="text-input" variant="body1">
            {project.name} ({project.startDate} - {project.endDate})
          </Typography>
          <Typography className="text-input" variant="body2">
            {project.description}
          </Typography>
          {project.highlights.map((highlight) => (
            <Typography variant="body2" key={highlight}>
              &#8226; {highlight}
            </Typography>
          ))}
        </div>
      ))}
    </Card>
  );
};

const Volunteer = () => {
  const volunteerWorks = useVolunteer();
  return (
    <Card
      elevation={3}
      style={{
        marginTop: 8,
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
    >
      <Typography variant="h5">Volunteers</Typography>
      <Stepper orientation="vertical" style={{ textAlign: "left" }} nonLinear>
        {volunteerWorks.map((item) => (
          <Step key={item.organization + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar style={{ width: 50, height: 50 }}>
                  {item.organization[0] || ""}
                </Avatar>
              }
            >
              <Typography className="text-input" variant="h6">
                {item.organization}
              </Typography>
              <Typography className="text-input" variant="subtitle1">
                {item.position}
              </Typography>
              <Typography className="text-input" variant="subtitle2">
                {item.startDate} - {item.endDate}
              </Typography>
              <Typography className="text-input" variant="subtitle2">
                {item.summary} | {item.website}
              </Typography>
            </StepLabel>
            <StepContent>
              {item.highlights.map((highlight) => (
                <Typography variant="body1" key={highlight}>
                  &#8226; {highlight}
                </Typography>
              ))}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Card>
  );
};

const Interests = () => {
  const interests = useInterests();
  return (
    <Card
      style={{
        marginTop: 8,
        width: "100%",
        padding: 12,
        backgroundColor: "var(--card)",
        color: "var(--input)",
      }}
      elevation={3}
    >
      <Typography variant="h5">Interests</Typography>
      {interests.map((interest) => (
        <div
          key={interest.name}
          style={{
            textAlign: "left",
            paddingLeft: 8,
            borderLeft: "4px solid green",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography variant="body1">{interest.name}</Typography>
          {get(interest, "keywords", []).map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              style={{ marginRight: 6, marginTop: 4, color: "var(--input)" }}
              size="small"
            />
          ))}
        </div>
      ))}
    </Card>
  );
};

const ResumeDisplay = () => (
  <div className="w-full flex flex-wrap">
    <div className="w-full xl:w-1/3 lg:w-1/3 md:w-full sm:w-full p-1">
      <div className="flex flex-col">
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

    <div className="w-full xl:w-2/3 lg:w-2/3 md:w-full sm:w-full p-1">
      <div className="flex flex-col">
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
