import { API, graphqlOperation } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";

export const useAWSAPI = (operation, input, authMode = "AMAZON_COGNITO_USER_POOLS") => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(operation, variables, ...args);
        const retrievedData = await API.graphql({ ...formattedOperation, authMode });
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [input, operation, authMode]
  );

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

export const useLazyAWSAPI = (operation, input) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(operation, variables, ...args);
        const retrievedData = await API.graphql(formattedOperation);
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [input, operation]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
};
