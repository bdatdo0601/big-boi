import React, { useCallback, useEffect, useState } from "react";
import { isArray, isString, uniq } from "lodash";
import PropTypes from "prop-types";

import { useGetFile, useUploadFile } from "../../utils/awsStorage";
import { REFERENCE_TAGS } from "../../utils/constants";
import { fetchFileToJSON } from "../../utils";

const ReferenceContext = React.createContext();

export const ReferenceContextProvider = ({ children }) => {
  const { file: referenceTagsStorage, loading: getFileLoading } = useGetFile(
    REFERENCE_TAGS.FILE_NAME,
    REFERENCE_TAGS.PREFIX
  );
  const { uploadFile, loading: uploading } = useUploadFile();
  const [suggestedReferenceTags, setSuggestedReferenceTags] = useState([]);
  useEffect(() => {
    if (referenceTagsStorage) {
      fetchFileToJSON(referenceTagsStorage)
        .then(jsonFile => {
          setSuggestedReferenceTags(jsonFile);
        })
        .catch(() => {
          setSuggestedReferenceTags([]);
        });
    }
  }, [referenceTagsStorage]);

  const syncReferenceTags = useCallback(async () => {
    try {
      const blob = new Blob([JSON.stringify(suggestedReferenceTags)], { type: "application/json" });
      await uploadFile(blob, REFERENCE_TAGS.FILE_NAME, REFERENCE_TAGS.PREFIX, "public");
      return suggestedReferenceTags;
    } catch (err) {
      console.error(err);
      return suggestedReferenceTags;
    }
  }, [uploadFile, suggestedReferenceTags]);

  const updateLocalReferenceTags = useCallback(newReferenceTagsFn => {
    setSuggestedReferenceTags(existingReferenceTags => {
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
