import React, { useState } from "react";
import PropTypes from "prop-types";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, List } from "@mui/material";

const MaterialListItem = ({ item, level, onClick, isSelected }) => {
  const [open, setOpen] = useState(item.defaultOpen);
  if (item.children) {
    return (
      <div>
        <button
          key={item.name}
          onClick={async () => {
            setOpen(!open);
          }}
          className="text-left flex flex-row gap-2 hover:bg-accent-foreground hover:cursor-pointer py-2 px-2 hover:rounded-lg"
        >
          {item.icon}
          <span
            className="text-lg"
            style={isSelected(item) ? { color: "var(--accent-foreground)" } : {}}
          >
            {item.name}
          </span>
          {open ? <ExpandLess /> : <ExpandMore />}
        </button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((childItem) => (
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
      </div>
    );
  }
  return (
    <button
      key={item.name}
      onClick={async () => {
        await onClick(item);
      }}
      className="text-left flex flex-row gap-2 hover:bg-foreground hover:cursor-pointer p-3 hover:rounded-lg"
      style={{
        marginLeft: `${level}px`,
      }}
    >
      {item.icon}
      <span
        className="text-lg"
        style={isSelected(item) ? { color: "var(--accent-foreground)", fontWeight: "bolder" } : {}}
      >
        {item.name}
      </span>
    </button>
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
  onClick: () => {
    /** */
  },
};

export default MaterialListItem;
