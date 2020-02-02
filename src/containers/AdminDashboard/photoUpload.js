import React from "react";
import { Card, Typography, CircularProgress, Grid } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useDropzoneStyles } from "./styleHooks";
import useGetDataList from "../../utils/hooks/useGetDataList";
import ImageFilePreview from "../../components/ImageFilePreview";

export default function PhotoUpload({ fetchFiles, uploadFile, deleteFile }) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: files, loading, refetch } = useGetDataList(fetchFiles);
  const classes = useDropzoneStyles();
  return (
    <Card className="my-8 mx-16 py-4 px-8">
      <Typography variant="h5">Photo Upload</Typography>
      {loading ? (
        <CircularProgress style={{ marginTop: 16 }} />
      ) : (
        <>
          <DropzoneArea
            acceptedFiles={["image/*"]}
            dropzoneClass={classes.imageDropzone}
            showAlerts
            filesLimit={1}
            onDrop={async file => {
              try {
                await uploadFile(file);
                await refetch();
                enqueueSnackbar("Uploaded Successfully", {
                  variant: "success",
                  anchorOrigin: { horizontal: "right", vertical: "top" },
                });
              } catch (err) {
                enqueueSnackbar(err.message ? err.message : "Unable to upload files", {
                  variant: "error",
                  anchorOrigin: { horizontal: "left", vertical: "top" },
                });
              }
            }}
            showPreviewsInDropzone={false}
          />
          <Grid container>
            {files.map(item => (
              <Grid item key={item.key} xs={12} sm={4} md={3} lg={4}>
                <ImageFilePreview
                  file={item}
                  onDelete={async () => {
                    await deleteFile(item);
                    await refetch();
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Card>
  );
}

PhotoUpload.propTypes = {
  fetchFiles: PropTypes.func,
  uploadFile: PropTypes.func,
  deleteFile: PropTypes.func,
};

PhotoUpload.defaultProps = {
  fetchFiles: async () => [],
  uploadFile: async () => {},
  deleteFile: async () => {},
};
