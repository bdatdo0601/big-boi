import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import ProfileCard from '../../../../components/ProfileCard';
import LayoutContext from '../../../../context/layout';
import ImagesDisplay from './imagesDisplay';
import './index.css';

export default function Gallery() {
  return (
    <div className="images-display-wrapper">
      <div className="my-4">
        <ImagesDisplay />
      </div>
    </div>
  );
}

Gallery.propTypes = {};
Gallery.defaultProps = {};
