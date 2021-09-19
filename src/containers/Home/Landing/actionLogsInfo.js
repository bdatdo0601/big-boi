import React, { useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { CSSTransition } from "react-transition-group";
import { Paper, Typography, Box, ListItemAvatar, ListItemText, ListItem, Avatar } from "@mui/material";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Info } from "@mui/icons-material";
import { FixedSizeList } from "react-window";

import EventMessageContext from "../../../context/eventmessage";
import "./index.less";

const AnimatedPaper = animated(Paper);

const ActionLogRow = props => {
  const { data, index, style } = props;

  const item = data[index];
  return (
    <CSSTransition in timeOut={200} classNames="action-logs-item">
      <ListItem key={index} style={style}>
        <ListItemAvatar>
          <Avatar>
            <Info />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item && item.publishInfo.message}
          secondary={moment(item && item.createdAt).format("MM/DD/YY hh:mm a")}
        />
      </ListItem>
    </CSSTransition>
  );
};

ActionLogRow.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function ActionLogsInfo({ className, animation }) {
  const { messages } = useContext(EventMessageContext);
  const [animateProps, setAnimateProps] = useSpring(() => ({
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    height: 350,
    width: "100%",
    transform: [0, 0],
    from: animation ? { transform: [0, -200] } : {},
    config: {
      mass: 10,
    },
  }));
  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setAnimateProps({ transform: down && animation ? [mx, my] : [0, 0], config: { mass: 3 } });
  });
  return (
    <AnimatedPaper
      className={className}
      elevation={3}
      {...bind()}
      style={{ ...animateProps, transform: animateProps.transform.to((x, y) => `translate(${x}px, ${y}px)`) }}
    >
      <Typography variant="h6" style={{ marginBottom: 8 }}>
        Action Logs
      </Typography>
      <Box sx={{ width: "100%", height: 400, bgcolor: "background.paper" }}>
        <FixedSizeList
          height={270}
          width={480}
          itemSize={80}
          itemCount={messages.length}
          overscanCount={0}
          itemData={messages}
        >
          {ActionLogRow}
        </FixedSizeList>
      </Box>
    </AnimatedPaper>
  );
}

ActionLogsInfo.propTypes = {
  className: PropTypes.string,
  animation: PropTypes.bool,
};

ActionLogsInfo.defaultProps = {
  className: "px-8 py-8",
  animation: false,
};
