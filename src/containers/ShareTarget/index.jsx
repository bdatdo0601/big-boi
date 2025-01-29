import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
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

const ShareTarget = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { execute: postReference } = useLazyAWSAPI(createReference);
  const { execute: postPrivateReference } = useLazyAWSAPI(
    createPrivateReference
  );

  const title = useMemo(() => params.name, [params]);
  const url = useMemo(() => params.link, [params]);
  const tags = useMemo(
    () => (params.tags || "").split(",").map((item) => item.trim()),
    [params]
  );
  const isPrivate = useMemo(() => params.get("isPrivate") || true, [params]);

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

  return (
    <div>
      Share Target: {title} {url} {isPrivate}
    </div>
  );
};

export default ShareTarget;
