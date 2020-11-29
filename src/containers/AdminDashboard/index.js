import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { fetchPhotos, uploadPhoto, deletePhoto } from "../../utils/awsStorage";
import PhotoUpload from "./photoUpload";
import ResumeSchemaEditor from "./resumeSchemaEditor";

export default function AdminDashboard() {
  return (
    <div className="container-div">
      <Typography variant="h2">Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <ResumeSchemaEditor />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <PhotoUpload fetchFiles={fetchPhotos} uploadFile={uploadPhoto} deleteFile={deletePhoto} />
        </Grid>
      </Grid>
    </div>
  );
}
