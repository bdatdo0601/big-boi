import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";

const descriptions = [
  `I wrote my first line of code ${new Date().getFullYear() -
    2010} years ago and it's been my passion ever since. I finished Bachelor's Degree in Computer Science at Wentworth Institute of Technology in 2018. Now, I build cool projects as a Software Engineer at Shell TechWorks`,
  "Outside from coding, I enjoy travelling and meeting people. During Summer 2015, I did an awesome roadtrip from New York to Seattle using only buses. I always open up to new opportunites and challenge myself so I can always be better than I was yesterday.",
];

export default function WelcomeInfo() {
  const { globalAnimation } = useContext(LayoutContext);
  return (
    <ProfileCard
      header={<Typography variant="h5">Welcome</Typography>}
      contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
      animation={globalAnimation}
    >
      <Typography variant="h5">This is my website</Typography>
      <Typography variant="caption" style={{ color: "grey" }}>
        Feel free to play around!
      </Typography>
      <div className="mx-4 my-2">
        {descriptions.map(item => (
          <Typography key={item} variant="body1" paragraph>
            {item}
          </Typography>
        ))}
      </div>
    </ProfileCard>
  );
}

WelcomeInfo.propTypes = {};
WelcomeInfo.defaultProps = {};
