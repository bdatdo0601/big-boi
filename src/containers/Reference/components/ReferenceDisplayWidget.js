import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography, List, ListItem, Grid, FormControlLabel, Switch } from "@mui/material";
import { get, isEmpty } from "lodash";
import useLocalStorageState from "use-local-storage-state";
import ReferenceRenderer from "./ReferenceRenderer";

const TreeReferenceDisplayWidget = ({ data, loading }) => {
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
    <div className={`drop-shadow-lg pl-1 ${level > 0 ? "border-l-2 ml-2" : ""}`}>
      {level !== 0 && <Typography className="mx-2">{get(data, "name")}</Typography>}
      {get(data, "references", []).length !== 0 && (
        <List>
          {get(data, "references", []).map(item => (
            <ListItem key={get(item, "id")} className="mt-1 px-2 p-0">
              <ReferenceRenderer reference={item} />
            </ListItem>
          ))}
        </List>
      )}
      <Grid container>
        {Object.values(get(data, "children", {}))
          .filter(item => get(item, "references", []).length !== 0 || !isEmpty(get(item, "children")))
          .map(item => (
            <Grid item key={get(item, "name")} lg={12} xl={level > 0 ? 12 : 6} md={12} xs={12} sm={12}>
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

  return (
    <div>
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
