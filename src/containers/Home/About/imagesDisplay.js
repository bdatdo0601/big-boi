import React from "react";
import PropTypes from "prop-types";
import { fetchPhotos } from "../../../utils/awsStorage";
import { GridList, GridListTile, CircularProgress, useMediaQuery } from "@material-ui/core";
import useGetDataList from "../../../utils/hooks/useGetDataList";
import ImageGridDisplay from "../../../components/ImageGridDisplay";
import { formatGridList } from "../../../utils";

export default function ImagesDisplay({ imageCols, cellHeight }) {
  const { data, loading } = useGetDataList(fetchPhotos);
  const isWeb = useMediaQuery("(min-width:600px)");
  console.log(data);
  if (loading) return <CircularProgress style={{ marginTop: 16 }} />;
  return (
    <>
      <GridList
        cols={isWeb ? imageCols : 1}
        style={{ width: "100%", marginTop: 32 }}
        spacing={4}
        cellHeight={cellHeight}
      >
        {formatGridList(data, imageCols, isWeb).map(image => (
          <GridListTile key={image.key} cols={image.metaData.cols} rows={1}>
            <ImageGridDisplay url={image.url} name={image.key} animation />
          </GridListTile>
        ))}
      </GridList>
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
