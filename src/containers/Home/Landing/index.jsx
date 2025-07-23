import { useMediaQuery } from '@mui/material';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext, useMemo, useRef } from 'react';
import Background from '@/containers/Home/Landing/Background';
import LayoutContext from '../../../context/layout';
import ActionLogsInfo from './actionLogsInfo';
import ContactInfo from './contactInfo';
import Gallery from './Gallery';
import MainInfo from './mainInfo';
import WelcomeInfo from './welcomeInfo';

export default function Landing({ keywords, contacts, bio }) {
  const { globalAnimation } = useContext(LayoutContext);
  return (
    <div className="w-full max-w-[1600px] mx-auto px-2">
      <div className="h-full mb-8 text-center flex flex-col items-center justify-center gap-12">
        <MainInfo animation={globalAnimation} keywords={keywords} containerStyle={{ marginBottom: '5rem' }} />
        <div className="flex flex-row justify-center gap-12 items-center max-lg:flex-wrap w-full">
          <WelcomeInfo bio={bio} />
          <ContactInfo animation={globalAnimation} contacts={contacts} />
        </div>
        <div className="w-full">
          <ActionLogsInfo animation={globalAnimation} keywords={keywords} />
        </div>
        <span id="background" className="text-2xl italic">
          A little bit more info 👀
        </span>
        <div>
          <Background />
        </div>
        <span id="gallery" className="text-2xl italic">
          Oh and here are some of my best memories 🫶
        </span>
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
