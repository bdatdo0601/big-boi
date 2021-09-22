import React from "react";
import PropTypes from "prop-types";
import { ImageList, ImageListItem, CircularProgress, useMediaQuery } from "@mui/material";
import { fetchPhotos } from "../../utils/awsStorage";
import useGetDataList from "../../utils/hooks/useGetDataList";
import ImageGridDisplay from "../../components/ImageGridDisplay";
import { formatGridList } from "../../utils";

export default function ImagesDisplay({ imageCols, cellHeight }) {
  const { data, loading } = useGetDataList(fetchPhotos);
  const isWeb = useMediaQuery("(min-width:600px)");
  if (loading) return <CircularProgress style={{ marginTop: 16 }} />;
  return (
    <>
      <ImageList cols={isWeb ? imageCols : 1} style={{ width: "100%", marginTop: 32, cellHeight }} spacing={4}>
        {formatGridList(data, imageCols, isWeb).map(image => (
          <ImageListItem key={image.key} cols={3} rows={3}>
            <ImageGridDisplay url={image.url} name={image.key} animation />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}

ImagesDisplay.propTypes = {
  imageCols: PropTypes.number,
  cellHeight: PropTypes.any,
};

ImagesDisplay.defaultProps = {
  imageCols: 12,
  cellHeight: 300,
};
