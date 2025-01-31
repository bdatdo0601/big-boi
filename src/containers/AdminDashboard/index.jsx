import React from "react";
import { fetchFiles, uploadFile, deleteFile } from "@/utils/awsStorage";
import PhotoUpload from "./photoUpload";
import ResumeSchemaEditor from "./resumeSchemaEditor";
import "./index.css";

export default function AdminDashboard() {
  return (
    <div className="mx-auto w-full flex flex-col gap-2 items-center my-2">
      <h2 className="text-3xl">Admin Dashboard</h2>
      <PhotoUpload
        fetchFiles={fetchFiles}
        uploadFile={uploadFile}
        deleteFile={deleteFile}
      />
      <ResumeSchemaEditor />
    </div>
  );
}
