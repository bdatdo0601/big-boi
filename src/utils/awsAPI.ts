import { useApi } from '@/context/api';
import { GraphQLResult, GraphQLSubscription, put } from '@aws-amplify/api';
import { get, merge, mergeWith } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

type EventData = {
  eventName: string;
  eventType: string;
  id: string;
  [key: string]: any;
};

export const publishEventData = async (event: EventData) => {
  try {
    await put({
      apiName: 'bigboiexternalapi',
      path: '/event',
      options: {
        body: { events: [{ eventData: event }], eventType: event.eventType, eventName: event.eventName },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const useAWSAPIGetAll = (operation: string, input: any) => {
  const { client } = useApi();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const execute = useCallback(
    async (variables = input, ...args: any[]) => {
      try {
        setLoading(true);
        let nextToken;
        const data = [];
        do {
          const retrievedData: GraphQLResult = await client.graphql<any>({
            query: operation,
            variables: {
              ...variables,
              nextToken,
            },
            ...args,
          });

          nextToken = get(retrievedData, 'data.nextToken');
          data.push(retrievedData);
        } while (nextToken);
        setData(data);
        setLoading(false);
        return data;
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [input, operation, client]
  );

  useEffect(() => {
    execute(input).then();
  }, [execute, input]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

export const useAWSAPI = (operation: string, input: any) => {
  const { client } = useApi();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(
    async (variables = input, ...args: any[]) => {
      try {
        setLoading(true);
        const retrievedData = await client.graphql({
          query: operation,
          variables,
          ...args,
        });
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        console.error(err, input, operation, client);
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [input, operation, client]
  );

  const fetchMore = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        let retrievedData: any;
        if (token) {
          retrievedData = await client.graphql({
            query: operation,
            variables: {
              ...input,
              nextToken: token,
            },
          });
          setData(currentData =>
            mergeWith(currentData, retrievedData, (objValue, srcValue) => {
              if (Array.isArray(objValue)) {
                return objValue.concat(srcValue);
              }
              return undefined;
            })
          );
        }
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [operation, client, input]
  );

  useEffect(() => {
    execute(input).then();
  }, [execute, input]);

  return {
    data,
    loading,
    error,
    execute,
    fetchMore,
  };
};

export const useSubscriptionAWSAPI = (subscription: string, onNext: Function, onError: Function) => {
  const { client } = useApi();
  useEffect(() => {
    const subsInstance: any = (
      client.graphql<any>({
        query: subscription,
      }) as GraphQLSubscription<any>
    ).subscribe({
      next: onNext,
      error: onError,
    });
    return () => {
      if (subsInstance.unsubscribe) {
        subsInstance.unsubscribe();
      }
    };
  }, [onError, onNext, subscription, client]);
};

export const useLazyAWSAPI = (operation: string, input?: any) => {
  const { client } = useApi();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const execute = useCallback(
    async (variables = input, ...args: any[]) => {
      try {
        setLoading(true);
        const retrievedData = await client.graphql({
          query: operation,
          variables,
          ...args,
        });
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [input, operation, client]
  );

  const fetchMore = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        let retrievedData: any;
        if (token) {
          retrievedData = await client.graphql({
            query: operation,
            variables: {
              nextToken: token,
            },
          });
          setData(currentData => merge(currentData, retrievedData));
        }
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [operation, client]
  );

  return {
    data,
    loading,
    error,
    execute,
    fetchMore,
  };
};
