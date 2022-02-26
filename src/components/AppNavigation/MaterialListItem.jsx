import React, { useState } from "react";
import PropTypes from "prop-types";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, List, useTheme, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const MaterialListItem = ({ item, level, onClick, isSelected }) => {
  const [open, setOpen] = useState(item.defaultOpen);
  const theme = useTheme();
  if (item.children) {
    return (
      <>
        <ListItem
          button
          onClick={async () => {
            setOpen(!open);
          }}
          style={{
            paddingLeft: theme.spacing(level * 2),
          }}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map(childItem => (
              <MaterialListItem
                key={childItem.name}
                item={childItem}
                onClick={onClick}
                level={level + 1}
                isSelected={isSelected}
              />
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
      selected={isSelected(item)}
      onClick={async () => {
        await onClick(item);
      }}
      style={{
        paddingLeft: theme.spacing(level * 2),
      }}
    >
      {item.icon && <ListItemIcon style={{ paddingRight: 0 }}>{item.icon}</ListItemIcon>}
      <ListItemText primary={item.name} />
    </ListItem>
  );
};

MaterialListItem.propTypes = {
  icon: PropTypes.node,
  isSelected: PropTypes.func,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.node,
    children: PropTypes.array,
    defaultOpen: PropTypes.bool,
  }),
  level: PropTypes.number,
  onClick: PropTypes.func,
};

MaterialListItem.defaultProps = {
  icon: null,
  isSelected: () => false,
  item: null,
  level: 1,
  onClick: () => {},
};

export default MaterialListItem;
