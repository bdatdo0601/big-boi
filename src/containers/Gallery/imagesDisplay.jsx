import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Masonry from "react-masonry-css";

import { fetchPhotos } from "../../utils/awsStorage";
import useGetDataList from "../../utils/hooks/useGetDataList";
import ImageGridDisplay from "../../components/ImageGridDisplay";
import { formatGridList } from "../../utils";

export default function ImagesDisplay({ imageCols }) {
  const { data, loading } = useGetDataList(fetchPhotos);
  const isWeb = useMediaQuery("(min-width:600px)");
  if (loading) return <CircularProgress style={{ marginTop: 16 }} />;
  return (
    <>
      <Masonry breakpointCols={isWeb ? 3 : 1} className="masonry-image" columnClassName="masonry-image-column">
        {formatGridList(data, imageCols, isWeb).map(image => (
          <ImageGridDisplay url={image.url} name={image.key} key={image.key} animation />
        ))}
      </Masonry>
    </>
  );
}

ImagesDisplay.propTypes = {
  imageCols: PropTypes.number,
};

ImagesDisplay.defaultProps = {
  imageCols: 12,
};
