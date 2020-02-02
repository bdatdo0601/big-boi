import React from "react";
import { Storage } from "aws-amplify";
import { Typography, Grid } from "@material-ui/core";
import PhotoUpload from "./photoUpload";

const PHOTO_UPLOAD_PREFIX = "PHOTO_UPLOAD/";

const fetchPhotos = async () => {
  const list = await Storage.list(PHOTO_UPLOAD_PREFIX);
  return await Promise.all(list.map(async item => ({ ...item, url: await Storage.get(item.key) })));
};

const uploadPhoto = async file => {
  await Storage.put(`${PHOTO_UPLOAD_PREFIX}${file.name}`, file);
};

const deletePhoto = async file => {
  await Storage.remove(file.key);
};

export default function AdminDashboard() {
  return (
    <div className="container-div">
      <Typography variant="h2">Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
          <PhotoUpload fetchFiles={fetchPhotos} uploadFile={uploadPhoto} deleteFile={deletePhoto} />
        </Grid>
      </Grid>
    </div>
  );
}
