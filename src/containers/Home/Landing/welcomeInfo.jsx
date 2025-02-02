import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";
import { Download } from "@mui/icons-material";
import PaperResumeRenderer from "@/containers/PaperResume/PaperResumeRenderer";
import { useReactToPrint } from "react-to-print";

export default function WelcomeInfo({ bio }) {
  const ref = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: ref });

  return (
    <ProfileCard
      header={<span className="text-2xl text-input">Hello There!</span>}
      contentStyle={{
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="mx-4 my-2 text-left">
          {bio.map((item) => (
            <p key={item} className="text-input">
              {item}
            </p>
          ))}
        </div>
        <button
          className="hover:cursor-pointer rounded-xl text-input shadow-lg bg-secondary px-3 py-2 mt-4"
          onClick={() => {
            reactToPrintFn();
          }}
        >
          <Download sx={{}} /> My Latest Resume
        </button>
      </div>
      <div className="hidden">
        <PaperResumeRenderer ref={ref} />
      </div>
    </ProfileCard>
  );
}

WelcomeInfo.propTypes = {
  bio: PropTypes.arrayOf(PropTypes.string),
};
WelcomeInfo.defaultProps = {
  bio: [],
};
