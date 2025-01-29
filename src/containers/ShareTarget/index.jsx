import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";

import {
  createPrivateReference,
  createReference,
} from "../../graphql/mutations";
import { useLazyAWSAPI } from "../../utils/awsAPI";
import { useDataUpdateWrapper } from "../../utils/hooks";
import EventType from "../../assets/event-type.json";

const DataUpdateOptions = {
  snackBar: {
    successMessage: "Reference Mutated",
    errorMessage: "Unable to Mutate Reference",
  },
  logging: {
    eventType: EventType.Personal.Reference.Update,
  },
};

const parsedUrl = new URL(String(window.location));

const ShareTarget = () => {
  const navigate = useNavigate();
  const { execute: postReference } = useLazyAWSAPI(createReference);
  const { execute: postPrivateReference } = useLazyAWSAPI(
    createPrivateReference
  );

  const title = useMemo(() => parsedUrl.searchParams.get("name"), []);
  const url = useMemo(() => parsedUrl.searchParams.get("link"), []);
  const tags = useMemo(
    () =>
      (parsedUrl.searchParams.get("tags") || "")
        .split(",")
        .map((item) => item.trim()),
    []
  );
  const isPrivate = useMemo(
    () => parsedUrl.searchParams.get("isPrivate") || true,
    []
  );

  const onReferenceMutate = useCallback(async () => {
    const variables = {
      input: {
        id: uuid(),
        clickCount: 0,
        title,
        url,
        type: "REFERENCES",
        tags,
      },
    };

    isPrivate
      ? await postPrivateReference(variables)
      : await postReference(variables);

    return { ...variables.input, isPrivate };
  }, [isPrivate, postPrivateReference, postReference, title, url, tags]);
  const onPostSubmit = useCallback(async () => {
    navigate("/", { replace: true });
  }, [navigate]);

  const [onSubmit] = useDataUpdateWrapper(
    onReferenceMutate,
    onPostSubmit,
    DataUpdateOptions
  );

  useEffect(() => {
    if (title && url) {
      onSubmit();
    } 
  }, [onSubmit, title, url]);

  return <div>
    Share Target: {title} {url} {isPrivate}
  </div>;
};

export default ShareTarget;
