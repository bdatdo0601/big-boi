import React, { useState } from "react";
import PropTypes from "prop-types";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { Collapse, List, useTheme, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

const MaterialListItem = ({ item, level }) => {
  const [open, setOpen] = useState(item.defaultOpen);
  const theme = useTheme();
  if (item.children) {
    return (
      <>
        <ListItem
          button
          onClick={async () => {
            await item.onClick();
            setOpen(!open);
          }}
          style={{
            paddingLeft: theme.spacing(level * 4),
          }}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map(childItem => (
              <MaterialListItem key={childItem.name} item={childItem} level={level + 1} />
            ))}
          </List>
        </Collapse>
      </>
    );
  }
  return (
    <ListItem
      button
      key={item.name}
      onClick={async () => {
        await item.onClick();
        setOpen(!open);
      }}
      style={{
        paddingLeft: theme.spacing(level * 4),
      }}
    >
      {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
      <ListItemText primary={item.name} />
    </ListItem>
  );
};

MaterialListItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.node,
    children: PropTypes.array,
  }),
  level: PropTypes.number,
};

MaterialListItem.defaultProps = {
  level: 1,
};

export default MaterialListItem;
