import { useCallback, useEffect, useRef, useState } from 'react';

const useGetDataList = fetchFn => {
  const isSubscribedRef = useRef(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const dataListFromServer = await fetchFn();
      if (isSubscribedRef.current) {
        setData(dataListFromServer);
      }
    } catch (_err) {
      if (isSubscribedRef.current) {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    getData().then(() => {
      /* empty */
    });
    return () => {
      isSubscribedRef.current = false;
    };
  }, [getData]);

  return {
    loading,
    data,
    refetch: getData,
  };
};

export default useGetDataList;
