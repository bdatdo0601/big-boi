import React, { useContext, useMemo, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";
import WelcomeInfo from "./welcomeInfo";
import ActionLogsInfo from "./actionLogsInfo";
import Background from "@/containers/Home/Landing/Background";
import Gallery from "./Gallery";

export default function Landing({ keywords, contacts, bio }) {
  const { globalAnimation } = useContext(LayoutContext);
  return (
    <div className="w-full max-w-[1600px] mx-auto px-2">
      <div className="h-full mb-8 text-center flex flex-col items-center justify-center gap-12">
        <MainInfo
          animation={globalAnimation}
          keywords={keywords}
          containerStyle={{ marginBottom: "5rem" }}
        />
        <div className="flex flex-row justify-between gap-12 items-start max-lg:flex-wrap">
          <WelcomeInfo bio={bio} />
          <ContactInfo animation={globalAnimation} contacts={contacts} />
        </div>
        <div className="w-full max-w-[800px]">
          <ActionLogsInfo animation={globalAnimation} keywords={keywords} />
        </div>
        <span id="background" className="text-2xl italic">A little bit more info 👀</span>
        <div>
          <Background />
        </div>
        <span id="gallery" className="text-2xl italic">Oh and here are some of my best memories 🫶</span>
        <div>
          <Gallery />
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string),
  contacts: PropTypes.arrayOf(PropTypes.object),
  bio: PropTypes.arrayOf(PropTypes.string),
};

Landing.defaultProps = {
  keywords: [],
  contacts: [],
  bio: [],
};
