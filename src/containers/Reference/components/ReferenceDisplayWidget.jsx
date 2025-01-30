import React, { useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  Grid2 as Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { get, isEmpty, uniq } from "lodash";
import { DeleteOutline } from "@mui/icons-material";
import useLocalStorageState from "use-local-storage-state";
import { useDrop } from "react-dnd";
import ReferenceRenderer from "./ReferenceRenderer";
import { DragDropTypes } from "../../../utils/constants";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import {
  updatePrivateReference,
  updateReference,
} from "../../../graphql/mutations";
import ReferenceContext from "../context";

const getSpanFromLevel = (level) => {
  if (level <= 0) {
    return { lg: 12, xl: 12, md: 12, xs: 12, sm: 12 };
  }
  if (level > 0 && level < 2) {
    return { lg: 4, xl: 4, md: 12, xs: 12, sm: 12 };
  }
  return { lg: 12, xl: 12, md: 12, xs: 12, sm: 12 };
};

const getListItemSpanFromLevel = (level) => {
  if (level <= 0) {
    return { lg: 12, xl: 12, md: 12, xs: 12, sm: 12 };
  }
  if (level > 0 && level < 2) {
    return { lg: 6, xl: 4, md: 12, xs: 12, sm: 12 };
  }
  return { lg: 12, xl: 12, md: 12, xs: 12, sm: 12 };
};

const TreeReferenceDisplayWidget = ({ data, loading }) => {
  const { execute: changeReference, loading: updatingReference } =
    useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } =
    useLazyAWSAPI(updatePrivateReference);
  const { requestRefetch } = useContext(ReferenceContext);

  const onLinkDropToMove = useCallback(
    async (item) => {
      if (
        updatingPrivateReference ||
        updatingReference ||
        get(item, "path") === get(data, "path")
      ) {
        return;
      }
      try {
        const variables = {
          input: {
            id: get(item, "id"),
            tags: uniq([
              ...get(item, "tags", []).filter(
                (tag) => tag !== get(item, "path")
              ),
              get(data, "path").replace(/s+/g, ""),
            ]),
          },
        };
        get(item, "isPrivate", true)
          ? await changePrivateReference(variables)
          : await changeReference(variables);
      } catch (err) {
        // eslint-disable-next-line
        console.error("Unable to delete: ", err);
      } finally {
        await requestRefetch();
      }
    },
    [
      data,
      changeReference,
      changePrivateReference,
      requestRefetch,
      updatingReference,
      updatingPrivateReference,
    ]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragDropTypes.LINK,
      drop: async (item) => {
        await onLinkDropToMove(item);
      },
      collect: (monitor) => ({
        isDragging: !!monitor.internalMonitor.isDragging(),
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const level = useMemo(
    () =>
      get(data, "path", "")
        .split(".")
        .filter((item) => item).length,
    [data]
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (
    get(data, "references", []).length === 0 &&
    isEmpty(get(data, "children"))
  ) {
    return null;
  }

  return (
    <div
      className={`${level > 0 ? "border-l-1 border-input pl-3" : ""} ${
        isOver ? "border-blue-600" : ""
      }`}
    >
      <div ref={drop}>
        {level !== 0 && (
          <span className="text-md font-bold text-input bg-foreground px-2 py-1 rounded-lg">
            {get(data, "name")}
          </span>
        )}
        {get(data, "references", []).length !== 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            {get(data, "references", []).map((item) => (
              <ReferenceRenderer
                key={get(item, "id")}
                reference={item}
                draggable
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-8 mt-2">
        {Object.values(get(data, "children", {}))
          .filter(
            (item) =>
              get(item, "references", []).length !== 0 ||
              !isEmpty(get(item, "children"))
          )
          .map((item) => (
            <TreeReferenceDisplayWidget
              key={get(item, "name")}
              data={item}
              loading={loading}
              bordered
            />
          ))}
      </div>
    </div>
  );
};

TreeReferenceDisplayWidget.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

TreeReferenceDisplayWidget.defaultProps = {};

const ReferenceDisplayWidget = ({ data, listData, widgetKey, ...props }) => {
  const [isDisplayTreeReference, setIsDisplayTreeReference] =
    useLocalStorageState(`isDisplayTreeReference${widgetKey}`, true);
  const { execute: changeReference, loading: updatingReference } =
    useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } =
    useLazyAWSAPI(updatePrivateReference);
  const { requestRefetch } = useContext(ReferenceContext);

  const onLinkDropToDelete = useCallback(
    async (item) => {
      if (updatingPrivateReference || updatingReference) {
        return;
      }
      try {
        const variables = {
          input: {
            id: get(item, "id"),
            tags: get(item, "tags", []).filter(
              (tag) => tag !== get(item, "path")
            ),
          },
        };
        get(item, "isPrivate", true)
          ? await changePrivateReference(variables)
          : await changeReference(variables);
      } catch (err) {
        // eslint-disable-next-line
        console.error("Unable to delete: ", err);
      } finally {
        await requestRefetch();
      }
    },
    [
      changeReference,
      changePrivateReference,
      requestRefetch,
      updatingReference,
      updatingPrivateReference,
    ]
  );

  const [{ isOver, isDragging }, drop] = useDrop(
    () => ({
      accept: DragDropTypes.LINK,
      drop: async (item) => {
        await onLinkDropToDelete(item);
      },
      collect: (monitor) => ({
        isDragging: !!monitor.internalMonitor.isDragging(),
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div>
      <div className="flex justify-between">
        <FormControlLabel
          control={
            <Switch
              checked={isDisplayTreeReference}
              onChange={(e, newValue) => {
                e.preventDefault();
                setIsDisplayTreeReference(newValue);
              }}
            />
          }
          label="Tree View"
        />
        {isDragging && (
          <div
            ref={drop}
            className={`h-10 border-dashed border-2  w-64 text-center pt-1 ${
              isOver ? "border-red-600 text-red-600" : ""
            } `}
          >
            <DeleteOutline sx={{ color: "var(--destructive)" }} /> Remove Tag
          </div>
        )}
      </div>
      {isDisplayTreeReference ? (
        <TreeReferenceDisplayWidget data={data} {...props} />
      ) : (
        <div className="flex flex-wrap gap-3">
          {(listData || []).map((item) => (
            <div key={get(item, "id")} className="mb-2">
              <ReferenceRenderer showTags reference={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ReferenceDisplayWidget.propTypes = {
  data: PropTypes.object.isRequired,
  listData: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  widgetKey: PropTypes.string.isRequired,
};

ReferenceDisplayWidget.defaultProps = {};

export default ReferenceDisplayWidget;
