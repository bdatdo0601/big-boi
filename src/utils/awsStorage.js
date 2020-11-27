import { Storage } from "aws-amplify";
import { get } from "lodash";

import awsconfig from "../aws-exports";
import { PHOTO_UPLOAD_PREFIX } from "./constants";
import { getImageMeta } from ".";

export const fetchPhotos = async (prefix = PHOTO_UPLOAD_PREFIX) => {
  const list = await Storage.list(prefix);
  return Promise.all(
    list.map(async item => {
      const url = await Storage.get(item.key);
      return { ...item, url, metaData: await getImageMeta(url) };
    })
  );
};
export const uploadPhoto = async (file, key = file.name, prefix = PHOTO_UPLOAD_PREFIX, level = "public") =>
  Storage.put(`${prefix}${key}`, file, { level });

export const getPhoto = async (key, prefix = PHOTO_UPLOAD_PREFIX) => Storage.get(`${prefix}${key}`);

export const getPhotoURL = (key, prefix = PHOTO_UPLOAD_PREFIX, level = "public") =>
  `https://${get(awsconfig, "aws_user_files_s3_bucket")}.s3.amazonaws.com/${level}/${prefix}${key}`;

export const deletePhoto = async file => {
  await Storage.remove(file.key);
};

export default {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
};
