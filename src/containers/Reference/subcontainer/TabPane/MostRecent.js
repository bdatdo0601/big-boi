import React, { useContext, useEffect, useMemo } from "react";
import { get, sortBy } from "lodash";
import { privateReferenceByUpdatedAt, referenceByUpdatedAt } from "../../../../graphql/queries";
import { useAWSAPI } from "../../../../utils/awsAPI";
import { convertToReferenceRenderedData } from "../../utils";
import ReferenceDisplayWidget from "../../components/ReferenceDisplayWidget";
import ReferenceContext from "../../context";

const MostRecent = () => {
  const query = useMemo(() => ({ type: "REFERENCES", sortDirection: "DESC", limit: 10000 }), []);
  const { data: rawPublicData, loading: publicDataLoading, execute: refetchReference } = useAWSAPI(
    referenceByUpdatedAt,
    query,
    "API_KEY"
  );
  const { data: rawPrivateData, loading: privateDataLoading, execute: refetchPrivateReference } = useAWSAPI(
    privateReferenceByUpdatedAt,
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
    const combinedData = sortBy(
      [
        ...get(rawPublicData, "data.ReferenceByUpdatedAt.items", []).map(item => ({ ...item, isPrivate: false })),
        ...get(rawPrivateData, "data.PrivateReferenceByUpdatedAt.items", []).map(item => ({
          ...item,
          isPrivate: true,
        })),
      ],
      "updatedAt"
    );

    return convertToReferenceRenderedData(combinedData);
  }, [rawPrivateData, rawPublicData]);

  return <ReferenceDisplayWidget data={data} loading={isLoading} />;
};

export default MostRecent;
