import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";

const descriptions = [
  "I came from Vietnam to the United States when I was 15 to start high school. I pursued and completed a Bachelor's Degree in Computer Science at Wentworth Institute of Technology back in 2018. At the moment, I am developing multiple cool projects as a Software Engineer at Shell TechWorks",
  `I wrote my first line of code ${new Date().getFullYear() -
    2010} years ago and it has been my passion ever since. I love building random stuff with different technology that I discover. My goal is to solve and automate as many thing as possible in my life. Outside from programming, I love to travel, cook, meet awesome people, and play video games.`,
  "I am always open to new opportunities and challenges. If you would like to reach me, feel free to drop me a message using any method under the Contact box.",
  "Thank you for visiting 😊!",
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
