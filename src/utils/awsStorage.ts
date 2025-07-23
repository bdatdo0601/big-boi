import { downloadData, getUrl, ListPaginateWithPathOutput, list, remove, uploadData } from '@aws-amplify/storage';
import { ItemWithPath } from 'node_modules/@aws-amplify/storage/dist/esm/providers/s3/types/outputs';
import { StorageDownloadDataOutput } from 'node_modules/@aws-amplify/storage/dist/esm/types';
import { useCallback, useEffect, useState } from 'react';
import { getImageMeta } from '.';
import { PHOTO_UPLOAD_PREFIX } from './constants';

export const getFileURL = async (key: string) => {
  const response = await getUrl({ path: key, options: { validateObjectExistence: true } });
  const url = response.url.toString();
  return url;
};

export const fetchFiles = async (prefix: string = PHOTO_UPLOAD_PREFIX) => {
  const fetchedList: ListPaginateWithPathOutput = await list({ path: prefix, options: { listAll: true } });

  return Promise.all(
    fetchedList.items.map(async item => {
      const url = await getFileURL(item.path);
      return { ...item, url, metaData: await getImageMeta(url), key: item.path };
    })
  );
};
export const uploadFile = async (file: any, key = file.name, prefix = PHOTO_UPLOAD_PREFIX) =>
  uploadData({
    path: `${prefix}${key}`,
    data: file,
  });

export const getFile = async (key: string, prefix = PHOTO_UPLOAD_PREFIX) => downloadData({ path: `${prefix}${key}` });

export const deleteFile = async (file: { key: string }) => {
  await remove({ path: file.key });
};

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const upload = useCallback(async (file: any, key: string, prefix: string) => {
    try {
      setLoading(true);
      const uploaded = await uploadFile(file, key, prefix);
      setLoading(false);
      return uploaded;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    upload,
  };
};

export const useGetFile = (key: string, prefix: string) => {
  const [file, setFile] = useState<StorageDownloadDataOutput<ItemWithPath> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchFile = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFile = await (await getFile(key, prefix)).result;
      setFile(fetchedFile);
      setLoading(false);
      return fetchedFile;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, [key, prefix]);

  useEffect(() => {
    fetchFile().then();
  }, [fetchFile]);

  return {
    file,
    loading,
    fetchFile,
    error,
  };
};

export const useGetFileURL = (key: string, prefix: string) => {
  const [url, setURL] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchURL = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFile = await getFileURL(`${prefix}${key}`);
      setURL(fetchedFile);
      setLoading(false);
      return fetchedFile;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, [key, prefix]);

  useEffect(() => {
    fetchURL().then();
  }, [fetchURL]);

  return {
    url,
    loading,
    fetchURL,
    error,
  };
};

export default {
  fetchFiles,
  uploadFile,
  deleteFile,
};
