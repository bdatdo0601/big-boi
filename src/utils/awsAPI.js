import { API, graphqlOperation } from "aws-amplify";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useAWSAPI = (operation, input, ...args) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formattedOperation = useMemo(() => graphqlOperation(operation), [operation]);
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const retrievedData = await API.graphql(formattedOperation, input, ...args);
      setData(retrievedData);
      return retrievedData;
    } catch (err) {
      setError(err);
      setLoading(false);
      return {};
    }
  }, [args, input, formattedOperation]);

  useEffect(() => {
    execute().then();
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

export const useLazyAWSAPI = (operation, input, ...args) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formattedOperation = useMemo(() => graphqlOperation(operation), [operation]);
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const retrievedData = await API.graphql(formattedOperation, input, ...args);
      setData(retrievedData);
      return retrievedData;
    } catch (err) {
      setError(err);
      setLoading(false);
      return {};
    }
  }, [args, input, formattedOperation]);

  return {
    data,
    loading,
    error,
    execute,
  };
};
