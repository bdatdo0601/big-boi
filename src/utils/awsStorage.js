import { Storage } from "aws-amplify";

import { PHOTO_UPLOAD_PREFIX } from "./constants";
import { getImageMeta } from ".";

export const fetchPhotos = async () => {
  const list = await Storage.list(PHOTO_UPLOAD_PREFIX);
  return await Promise.all(
    list.map(async item => {
      const url = await Storage.get(item.key);
      return { ...item, url, metaData: await getImageMeta(url) };
    })
  );
};

export const uploadPhoto = async file => {
  await Storage.put(`${PHOTO_UPLOAD_PREFIX}${file.name}`, file);
};

export const deletePhoto = async file => {
  await Storage.remove(file.key);
};

export default {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
};
