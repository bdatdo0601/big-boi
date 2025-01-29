import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { v4 as uuid } from "uuid";

import {
  createPrivateReference,
  createReference,
} from "../../graphql/mutations";
import { useLazyAWSAPI } from "../../utils/awsAPI";
import { useDataUpdateWrapper } from "../../utils/hooks";
import EventType from "../../assets/event-type.json";

const ShareTarget = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { execute: postReference } = useLazyAWSAPI(createReference);
  const { execute: postPrivateReference } = useLazyAWSAPI(
    createPrivateReference
  );

  const title = useMemo(() => searchParams.get("name"), [searchParams]);
  const url = useMemo(() => searchParams.get("link"), [searchParams]);
  const tags = useMemo(
    () =>
      (searchParams.get("tags") || "").split(",").map((item) => item.trim()),
    [searchParams]
  );
  const isPrivate = useMemo(
    () => searchParams.get("isPrivate") || true,
    [searchParams]
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
    navigate("/reference", { replace: true });
  }, [navigate]);

  const DataUpdateOptions = useMemo(
    () => ({
      snackBar: {
        successMessage: `Add new reference ${title} (${url})`,
        errorMessage: `Unable to add ${title} (${url})`,
      },
      logging: {
        eventType: EventType.Personal.Reference.Update,
      },
    }),
    [title, url]
  );

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

  return (
    <div>
      Share Target: {searchParams.getAll().join(", ")}
    </div>
  );
};

export default ShareTarget;
