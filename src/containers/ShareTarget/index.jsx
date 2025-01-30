import { useEffect, useMemo, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { v4 as uuid } from "uuid";

import {
  createPrivateReference,
  createReference,
} from "../../graphql/mutations";
import { useLazyAWSAPI } from "../../utils/awsAPI";
import { useDataUpdateWrapper } from "../../utils/hooks";
import EventType from "../../assets/event-type.json";
import ReferenceInputWidget from "../Reference/components/ReferenceInputWidget";
import { ReferenceContextProvider } from "../Reference/context";

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const ShareTarget = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const title = useMemo(
    () => decodeURI(searchParams.get("name") || ""),
    [searchParams]
  );
  const description = useMemo(
    () => decodeURI(searchParams.get("description") || ""),
    [searchParams]
  );
  const url = useMemo(
    () => decodeURI(searchParams.get("link") || ""),
    [searchParams]
  );

  const validURLS = useMemo(() => {
    const searchStrings = [title, description, url]
      .filter((item) => item)
      .join(" ");
    return searchStrings.match(urlRegex) || [];
  }, [url, title, description]);

  const referenceTitle = useMemo(() => {
    if (title) return title;
    return [description]
      .map((item) => item.replace(urlRegex, ""))
      .filter((item) => item)
      .join(" - ");
  }, [title, description]);

  const tags = useMemo(
    () =>
      decodeURI(searchParams.get("tags") || "")
        .split(",")
        .map((item) => item.trim()),
    [searchParams]
  );
  const isPrivate = useMemo(
    () => searchParams.get("isPrivate") || false,
    [searchParams]
  );

  const [referenceData, setReferenceData] = useState({
    title: referenceTitle,
    url: validURLS[0],
    tags,
    isPrivate,
  });

  const onPostSubmit = useCallback(async () => {
    navigate("/reference", { replace: true });
  }, [navigate]);

  return (
    <ReferenceContextProvider>
      <div className="p-4 bg-card flex flex-col gap-4">
        <span className="text-xl">Link Share Detected!!</span>
        {validURLS.length > 1 && (
          <div className="bg-card-foreground w-full p-2 rounded-lg">
            <span className="text-lg">Multiple URLS Detected!!</span>
            <select
              className="w-full p-2 rounded-md bg-secondary px-2"
              onChange={(e) =>
                setReferenceData({ ...referenceData, url: e.target.value })
              }
            >
              {validURLS.map((url, index) => (
                <option key={index} value={url}>
                  {url}
                </option>
              ))}
            </select>
          </div>
        )}
        <ReferenceInputWidget
          existingReference={referenceData}
          createNew
          onReferenceUpserted={() => {
            onPostSubmit();
          }}
        />
        <pre className="text-wrap break-all p-4 rounded-lg bg-muted">
          Share Target: {searchParams.toString()}
        </pre>
      </div>
    </ReferenceContextProvider>
  );
};

export default ShareTarget;
