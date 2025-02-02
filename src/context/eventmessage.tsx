import React, { useCallback, useMemo, useState } from "react";
import { get, isEmpty } from "lodash";
import { useSnackbar } from "notistack";

import { useAWSAPI, useSubscriptionAWSAPI } from "../utils/awsAPI";
import { EventMessageByTimestamp } from "@/graphql/queries";
import { onCreateEventMessage } from "@/graphql/subscriptions";

type RawMessage = {
  publishInfo: string;
  [key: string]: any;
};

export type EventMessage = {
  publishInfo: Record<string, any>;
  [key: string]: any;
};

const EventMessageContext = React.createContext<{
  messages: EventMessage[];
  loading: boolean;
  fetchMore: () => Promise<void>;
  newMessages: EventMessage[];
  isDataComplete: boolean;
}>({
  messages: [],
  loading: false,
  fetchMore: () => new Promise((res) => res()),
  newMessages: [],
  isDataComplete: false,
});

const formatItem = (rawItem: RawMessage): EventMessage => ({
  ...rawItem,
  publishInfo: JSON.parse(get(rawItem, "publishInfo", "{}")),
});

export const EventMessageContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const variableInputs = useMemo(
    () => ({
      type: "Event",
      limit: 20,
      sortDirection: "DESC",
    }),
    []
  );
  const { data: rawMessages, loading, fetchMore, execute } = useAWSAPI(
    EventMessageByTimestamp,
    variableInputs,
  );
  const [newlyArrivedMessages] = useState<EventMessage[]>([]);

  const onNewDataNotified = useCallback(
    async ({ data }: { data: RawMessage }) => {
      const item = formatItem(data);
      if (!isEmpty(get(item, "publishInfo.message"))) {
        enqueueSnackbar(get(item, "publishInfo.message"), {
          variant: "info",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
      }
      execute();
    },
    [enqueueSnackbar, execute]
  );

  const nextToken: string | undefined = useMemo(() => get(rawMessages, "data.EventMessageByTimestamp.nextToken", "-1"), [rawMessages]);
  const fetchMoreMessages = useCallback(
    async () => {
      if (nextToken) {
        await fetchMore(nextToken);
      }
    },
    [fetchMore, nextToken]
  );

  const messages: EventMessage[] = get(rawMessages, "data.EventMessageByTimestamp.items", []).map(item => formatItem(item)); -

    useSubscriptionAWSAPI(onCreateEventMessage, onNewDataNotified, console.error);
  return <EventMessageContext.Provider value={{ messages, loading, fetchMore: fetchMoreMessages, newMessages: newlyArrivedMessages, isDataComplete: isEmpty(nextToken) }}>{children}</EventMessageContext.Provider>;
};

export default EventMessageContext;
