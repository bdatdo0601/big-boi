import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { get, sortBy, reverse, isEmpty } from "lodash";
import { useSnackbar } from "notistack";

import { useAWSAPI, useSubscriptionAWSAPI } from "../utils/awsAPI";

const EventMessageContext = React.createContext();

const listEventMessagesByTimeStamp = /* GraphQL */ `
  query EventMessageByTimestamp(
    $type: String
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    EventMessageByTimestamp(
      type: $type
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        eventType
        publishInfo
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const onCreateEventMessage = /* GraphQL */ `
  subscription OnCreateEventMessage {
    onCreateEventMessage {
      id
    }
  }
`;

const formatItem = rawItem => ({
  ...rawItem,
  publishInfo: JSON.parse(get(rawItem, "publishInfo", "{}")),
});

export const EventMessageContextProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const variableInputs = useMemo(
    () => ({
      type: "Event",
      limit: 100,
      sortDirection: "DESC",
    }),
    []
  );
  const { data: rawMessages, loading, execute: refetch } = useAWSAPI(
    listEventMessagesByTimeStamp,
    variableInputs,
    "API_KEY"
  );

  const onNewDataNotified = useCallback(
    async ({ value }) => {
      const rawNewList = await refetch();
      const newList = get(rawNewList, "data.EventMessageByTimestamp.items", []);
      const newData = formatItem(newList.find(item => item.id === get(value, "data.onCreateEventMessage.id")));
      if (!isEmpty(get(newData, "publishInfo.message"))) {
        enqueueSnackbar(get(newData, "publishInfo.message"), {
          variant: "info",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
      }
    },
    [enqueueSnackbar, refetch]
  );

  const messages = useMemo(
    () =>
      reverse(
        sortBy(
          get(rawMessages, "data.EventMessageByTimestamp.items", []).map(item => formatItem(item)),
          "createdAt"
        )
      ),
    [rawMessages]
  );
  useSubscriptionAWSAPI(onCreateEventMessage, onNewDataNotified, console.error, "API_KEY");
  return <EventMessageContext.Provider value={{ messages, loading }}>{children}</EventMessageContext.Provider>;
};

EventMessageContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EventMessageContext;
