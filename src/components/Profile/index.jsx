import { Typography } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import MAIN_PICTURE from '../../assets/main_picture.jpg';
import LayoutContext from '../../context/layout';

import './index.css';

export default function Profile({ image, name, wrapperStyle, imageStyle, animation }) {
  const [imageProps, api] = useSpring(() => ({
    from: animation ? { opacity: 0, transform: [0, -100] } : {},
    transform: [0, 0],
    opacity: 1,
    marginBottom: 32,
    borderRadius: '50%',
    ...imageStyle,
    config: {
      mass: 2,
    },
  }));
  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    api.start({
      transform: down && animation ? [mx, my] : [0, 0],
    });
  });
  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 72,
        marginBottom: 32,
        ...wrapperStyle,
      }}
    >
      <animated.img
        className="w-56 h-56 profile-image border-foreground shadow-2xl border-8"
        src={image || MAIN_PICTURE}
        alt="main_picture"
        style={{ ...imageProps, transform: imageProps.transform.to((x, y) => `translate(${x}px, ${y}px)`) }}
        {...bind()}
      />
      <Typography variant="h3">{name}</Typography>
    </div>
  );
}

Profile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  wrapperStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  animation: PropTypes.bool,
};

Profile.defaultProps = {
  image: MAIN_PICTURE,
  name: 'Dat Do',
  title: 'Software Engineer @ STW',
  wrapperStyle: {},
  imageStyle: {},
  animation: false,
};
