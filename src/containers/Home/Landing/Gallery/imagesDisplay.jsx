import { CircularProgress, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Masonry from 'react-masonry-css';
import ImageGridDisplay from '../../../../components/ImageGridDisplay';
import { formatGridList } from '../../../../utils';
import { fetchFiles } from '../../../../utils/awsStorage';
import useGetDataList from '../../../../utils/hooks/useGetDataList';

export default function ImagesDisplay({ imageCols }) {
  const { data, loading } = useGetDataList(fetchFiles);
  const isWeb = useMediaQuery('(min-width:600px)');
  if (loading)
    return (
      <div className="w-full *:text-center mx-auto">
        <CircularProgress />
      </div>
    );
  return (
    <Masonry breakpointCols={isWeb ? 3 : 1} className="masonry-image" columnClassName="masonry-image-column">
      {formatGridList(data, imageCols, isWeb).map(image => (
        <ImageGridDisplay url={image.url} name={image.key} key={image.key} animation />
      ))}
    </Masonry>
  );
}

ImagesDisplay.propTypes = {
  imageCols: PropTypes.number,
};

ImagesDisplay.defaultProps = {
  imageCols: 12,
};
