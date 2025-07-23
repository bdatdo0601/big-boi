import { getCurrentUser } from '@aws-amplify/auth';
import { isArray, isString, uniq, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { fetchFileToJSON } from '../../utils';
import { useGetFile, useUploadFile } from '../../utils/awsStorage';
import { REFERENCE_TAGS } from '../../utils/constants';

const ReferenceContext = React.createContext();

const useStorageReferenceTags = () => {
  const { file: rawReferenceTags, loading } = useGetFile(REFERENCE_TAGS.FILE_NAME, REFERENCE_TAGS.PREFIX);
  const [referenceTags, setReferenceTags] = useState([]);
  const [fetchLoading, setFetchLoading] = useState < boolean > true;

  useEffect(() => {
    if (rawReferenceTags) {
      rawReferenceTags.body
        .text()
        .then(newRefTags => {
          setReferenceTags(JSON.parse(newRefTags));
          setFetchLoading(false);
        })
        .catch(err => {
          console.error(err);
          setFetchLoading(false);
        });
    }
  }, [rawReferenceTags, setFetchLoading]);

  return { referenceTags, loading: loading && fetchLoading };
};

export const ReferenceContextProvider = ({ children }) => {
  const { referenceTags: suggestedReferenceTags, loading: getFileLoading } = useStorageReferenceTags();
  const { upload, loading: uploading } = useUploadFile();
  const [refetchFns, setRefetchFns] = useState([]);
  const { user: currentUser } = useAuth();
  const [_, setLocalRefTags] = useState(suggestedReferenceTags);

  const registerRefetch = useCallback((name, refetchFn) => {
    setRefetchFns(existingRefetchFns => uniqBy([...existingRefetchFns, { name, refetchFn }], 'name'));
  }, []);

  const deregisterRefetch = useCallback(name => {
    setRefetchFns(existingRefetchFns => existingRefetchFns.filter(item => item.name !== name));
  }, []);

  const requestRefetch = useCallback(async () => {
    await Promise.all(
      refetchFns.map(async obj => {
        await obj.refetchFn();
      })
    );
  }, [refetchFns]);

  const syncReferenceTags = useCallback(async () => {
    try {
      const blob = new Blob([JSON.stringify(suggestedReferenceTags)], { type: 'application/json' });
      await upload(blob, REFERENCE_TAGS.FILE_NAME, REFERENCE_TAGS.PREFIX, 'public');
      return suggestedReferenceTags;
    } catch (err) {
      console.error(err);
      return suggestedReferenceTags;
    }
  }, [upload, suggestedReferenceTags]);

  const updateLocalReferenceTags = useCallback(newReferenceTagsFn => {
    setLocalRefTags(existingReferenceTags => {
      const newReferenceTags = newReferenceTagsFn(existingReferenceTags);
      if (isArray(newReferenceTags) && newReferenceTags.every(tag => isString(tag))) {
        return uniq(newReferenceTags);
      }
      return existingReferenceTags;
    });
  }, []);

  return (
    <ReferenceContext.Provider
      value={{
        suggestedReferenceTags,
        syncReferenceTags,
        updateLocalReferenceTags,
        loading: getFileLoading || uploading,
        registerRefetch,
        deregisterRefetch,
        requestRefetch,
        currentUser,
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
};

ReferenceContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReferenceContext;
