import React, { useContext, useEffect, useMemo } from "react";
import { get, reverse, sortBy } from "lodash";
import { privateReferenceByClickCount, referenceByClickCount } from "../../../../graphql/queries";
import { useAWSAPI } from "../../../../utils/awsAPI";
import { convertToReferenceRenderedData } from "../../utils";
import ReferenceDisplayWidget from "../../components/ReferenceDisplayWidget";
import ReferenceContext from "../../context";

const MostFrequent = () => {
  const query = useMemo(() => ({ type: "REFERENCES", sortDirection: "DESC", limit: 100 }), []);
  const { data: rawPublicData, loading: publicDataLoading, execute: refetchReference } = useAWSAPI(
    referenceByClickCount,
    query,
    "API_KEY"
  );
  const { data: rawPrivateData, loading: privateDataLoading, execute: refetchPrivateReference } = useAWSAPI(
    privateReferenceByClickCount,
    query
  );
  const { registerRefetch, deregisterRefetch } = useContext(ReferenceContext);
  const isLoading = useMemo(() => publicDataLoading || privateDataLoading, [publicDataLoading, privateDataLoading]);

  useEffect(() => {
    registerRefetch("MostFrequent", async () =>
      Promise.all(
        [refetchReference, refetchPrivateReference].map(async fn => {
          fn();
        })
      )
    );
    return () => {
      deregisterRefetch("MostFrequent");
    };
  }, [registerRefetch, refetchReference, refetchPrivateReference, deregisterRefetch]);

  const data = useMemo(() => {
    const combinedData = reverse(
      sortBy(
        [
          ...get(rawPublicData, "data.ReferenceByClickCount.items", []).map(item => ({ ...item, isPrivate: false })),
          ...get(rawPrivateData, "data.PrivateReferenceByClickCount.items", []).map(item => ({
            ...item,
            isPrivate: true,
          })),
        ],
        "clickCount"
      )
    );

    return convertToReferenceRenderedData(combinedData);
  }, [rawPrivateData, rawPublicData]);

  return <ReferenceDisplayWidget data={data} loading={isLoading} />;
};

export default MostFrequent;
