import React, { useContext, useEffect, useMemo } from "react";
import { get, sortBy } from "lodash";
import { listPrivateReferences, listReferences } from "../../../../graphql/queries";
import { useAWSAPI } from "../../../../utils/awsAPI";
import { convertToReferenceRenderedData } from "../../utils";
import ReferenceDisplayWidget from "../../components/ReferenceDisplayWidget";
import ReferenceContext from "../../context";

const TagAlphabetical = () => {
  const query = useMemo(() => ({ limit: 10000 }), []);
  const { data: rawPublicData, loading: publicDataLoading, execute: refetchReference } = useAWSAPI(
    listReferences,
    query,
    "API_KEY"
  );
  const { data: rawPrivateData, loading: privateDataLoading, execute: refetchPrivateReference } = useAWSAPI(
    listPrivateReferences,
    query
  );
  const { registerRefetch, deregisterRefetch } = useContext(ReferenceContext);
  const isLoading = useMemo(() => publicDataLoading || privateDataLoading, [publicDataLoading, privateDataLoading]);

  useEffect(() => {
    registerRefetch("TagAlphabetical", async () =>
      Promise.all(
        [refetchReference, refetchPrivateReference].map(async fn => {
          fn();
        })
      )
    );
    return () => {
      deregisterRefetch("TagAlphabetical");
    };
  }, [registerRefetch, refetchReference, refetchPrivateReference, deregisterRefetch]);

  const combinedData = useMemo(
    () =>
      sortBy(
        [
          ...get(rawPublicData, "data.listReferences.items", []).map(item => ({
            ...item,
            tags: sortBy(get(item, "tags", []), tag => tag),
            isPrivate: false,
          })),
          ...get(rawPrivateData, "data.listPrivateReferences.items", []).map(item => ({
            ...item,
            tags: sortBy(get(item, "tags", []), tag => tag),
            isPrivate: true,
          })),
        ],
        "tags"
      ),
    [rawPrivateData, rawPublicData]
  );

  const treeData = useMemo(() => convertToReferenceRenderedData(combinedData), [combinedData]);

  return (
    <ReferenceDisplayWidget widgetKey="TagAlphabetical" data={treeData} listData={combinedData} loading={isLoading} />
  );
};

export default TagAlphabetical;
