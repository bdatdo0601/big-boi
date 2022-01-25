import React, { useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography, List, ListItem, Grid, FormControlLabel, Switch } from "@mui/material";
import { get, isEmpty, uniq } from "lodash";
import { DeleteOutline } from "@mui/icons-material";
import useLocalStorageState from "use-local-storage-state";
import { useDrop } from "react-dnd";
import ReferenceRenderer from "./ReferenceRenderer";
import { DragDropTypes } from "../../../utils/constants";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import { updatePrivateReference, updateReference } from "../../../graphql/mutations";
import ReferenceContext from "../context";

const TreeReferenceDisplayWidget = ({ data, loading }) => {
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { requestRefetch } = useContext(ReferenceContext);

  const onLinkDropToMove = useCallback(
    async item => {
      if (updatingPrivateReference || updatingReference || get(item, "path") === get(data, "path")) {
        return;
      }
      try {
        const variables = {
          input: {
            id: get(item, "id"),
            tags: uniq([...get(item, "tags", []).filter(tag => tag !== get(item, "path")), get(data, "path")]),
          },
        };
        get(item, "isPrivate", true) ? await changePrivateReference(variables) : await changeReference(variables);
      } catch (err) {
        // eslint-disable-next-line
        console.error("Unable to delete: ", err);
      } finally {
        await requestRefetch();
      }
    },
    [data, changeReference, changePrivateReference, requestRefetch, updatingReference, updatingPrivateReference]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragDropTypes.LINK,
      drop: async item => {
        await onLinkDropToMove(item);
      },
      collect: monitor => ({
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
        .filter(item => item).length,
    [data]
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (get(data, "references", []).length === 0 && isEmpty(get(data, "children"))) {
    return null;
  }

  return (
    <div className={`pl-1 ${level > 0 ? "border-l-2" : ""} ${isOver ? "border-blue-600" : ""}`}>
      <div ref={drop}>
        {level !== 0 && <Typography className="mx-2 mb-1">{get(data, "name")}</Typography>}
        {get(data, "references", []).length !== 0 && (
          <List>
            {get(data, "references", []).map(item => (
              <ListItem key={get(item, "id")} className="mt-1 px-2 p-0">
                <ReferenceRenderer reference={item} draggable />
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <Grid container>
        {Object.values(get(data, "children", {}))
          .filter(item => get(item, "references", []).length !== 0 || !isEmpty(get(item, "children")))
          .map(item => (
            <Grid
              item
              key={get(item, "name")}
              lg={level > 0 ? 12 : 6}
              xl={level > 0 ? 12 : 4}
              md={12}
              xs={12}
              sm={12}
              className={level === 0 ? "mt-2" : "mt-1"}
            >
              <TreeReferenceDisplayWidget data={item} loading={loading} bordered />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

TreeReferenceDisplayWidget.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

TreeReferenceDisplayWidget.defaultProps = {};

const ReferenceDisplayWidget = ({ data, listData, widgetKey, ...props }) => {
  const [isDisplayTreeReference, setIsDisplayTreeReference] = useLocalStorageState(
    `isDisplayTreeReference${widgetKey}`,
    true
  );
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { requestRefetch } = useContext(ReferenceContext);

  const onLinkDropToDelete = useCallback(
    async item => {
      if (updatingPrivateReference || updatingReference) {
        return;
      }
      try {
        const variables = {
          input: {
            id: get(item, "id"),
            tags: get(item, "tags", []).filter(tag => tag !== get(item, "path")),
          },
        };
        get(item, "isPrivate", true) ? await changePrivateReference(variables) : await changeReference(variables);
      } catch (err) {
        // eslint-disable-next-line
        console.error("Unable to delete: ", err);
      } finally {
        await requestRefetch();
      }
    },
    [changeReference, changePrivateReference, requestRefetch, updatingReference, updatingPrivateReference]
  );

  const [{ isOver, isDragging }, drop] = useDrop(
    () => ({
      accept: DragDropTypes.LINK,
      drop: async item => {
        await onLinkDropToDelete(item);
      },
      collect: monitor => ({
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
            <DeleteOutline /> Remove Tag
          </div>
        )}
      </div>
      {isDisplayTreeReference ? (
        <TreeReferenceDisplayWidget data={data} {...props} />
      ) : (
        <List>
          {(listData || []).map(item => (
            <ListItem key={get(item, "id")} className="mt-1 px-2 p-0">
              <ReferenceRenderer showTags reference={item} />
            </ListItem>
          ))}
        </List>
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
