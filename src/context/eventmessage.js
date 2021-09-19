import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { toInteger, get } from "lodash";
import { useSnackbar } from "notistack";

import { useAWSAPI, useSubscriptionAWSAPI } from "../utils/awsAPI";

const EventMessageContext = React.createContext();

const listEventMessageDatas = /* GraphQL */ `
  query ListEventMessageDatas($filter: ModelEventMessageDataFilterInput, $limit: Int, $nextToken: String) {
    listEventMessageDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

const onCreateEventMessageData = /* GraphQL */ `
  subscription OnCreateEventMessageData {
    onCreateEventMessageData {
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
      limit: 100,
      filter: {
        timestamp: {
          ge: toInteger(
            moment()
              .subtract(1, "month")
              .unix()
          ),
        },
      },
    }),
    []
  );
  const { data: rawMessages, loading, execute: refetch } = useAWSAPI(listEventMessageDatas, variableInputs, "API_KEY");

  const onNewDataNotified = useCallback(
    async ({ value, provider }) => {
      console.log(value, provider);
      const rawNewList = await refetch();
      const newList = get(rawNewList, "data.listEventMessageDatas.items", []);
      const newData = formatItem(newList.find(item => item.id === get(value, "data.onCreateEventMessageData.id")));

      enqueueSnackbar(get(newData, "publishInfo.message"), {
        variant: "info",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
    },
    [enqueueSnackbar, refetch]
  );

  const messages = useMemo(
    () => get(rawMessages, "data.listEventMessageDatas.items", []).map(item => formatItem(item)),
    [rawMessages]
  );
  console.log(messages);
  useSubscriptionAWSAPI(onCreateEventMessageData, onNewDataNotified, console.error);
  return <EventMessageContext.Provider value={{ messages, loading }}>{children}</EventMessageContext.Provider>;
};

EventMessageContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EventMessageContext;
