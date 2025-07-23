/* eslint-disable jsx-a11y/label-has-associated-control */

import UploadFile from '@mui/icons-material/UploadFile';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import ImageFilePreview from '../../components/ImageFilePreview';
import useGetDataList from '../../utils/hooks/useGetDataList';

const classes = {
  imageDropzone: 'imageDropzone',
};

const StyledDropzone = styled('div')(({ theme }) => ({
  [`&.${classes.imageDropzone}`]: {
    minHeight: 100,
    marginTop: 16,
    backgroundColor: theme.palette.background.default,
    padding: 16,
  },
}));

export default function PhotoUpload({ fetchFiles, uploadFile, deleteFile }) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: files, loading, refetch } = useGetDataList(fetchFiles);

  return (
    <StyledDropzone>
      <div className="p-4 overflow-auto bg-accent rounded-lg mx-2">
        <div className="flex flex-col items-center my-2 gap-2">
          <h5 className="text-2xl">Photo Upload</h5>
        </div>
        {loading ? (
          <CircularProgress style={{ marginTop: 24 }} />
        ) : (
          <>
            <input
              accept="image/*"
              className={classes.input}
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={async e => {
                try {
                  const uploadingFiles = e.target.files;
                  for (let i = 0; i < uploadingFiles.length; i++) {
                    await uploadFile(uploadingFiles.item(i));
                  }
                  await refetch();
                  enqueueSnackbar('Uploaded Successfully', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                  });
                } catch (err) {
                  enqueueSnackbar(err.message ? err.message : 'Unable to upload files', {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'left', vertical: 'top' },
                  });
                }
              }}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" style={{ margin: 12 }}>
                <UploadFile style={{ marginRight: 4 }} /> Upload Images
              </Button>
            </label>
            <div className="flex flex-wrap gap-2 my-12">
              {files.map(item => (
                <ImageFilePreview
                  key={item.key}
                  file={item}
                  onDelete={async () => {
                    await deleteFile(item);
                    await refetch();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </StyledDropzone>
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
