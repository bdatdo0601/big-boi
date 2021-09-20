import React, { useContext, useMemo } from "react";
import { flattenDeep, get, isString } from "lodash";
import PropTypes from "prop-types";
import moment from "moment";
import { Paper, Typography, Alert, AlertTitle, ListItem, Link } from "@mui/material";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { FixedSizeList } from "react-window";
import * as Icons from "@mui/icons-material";

import ReactStringReplacer from "../../../utils/reactStringReplacer";
import EventMessageContext from "../../../context/eventmessage";
import "./index.less";

const AnimatedPaper = animated(Paper);
const AnimatedListItem = animated(ListItem);

const ActionLogRow = props => {
  const { data, index, style } = props;
  const [animateProps] = useSpring(() => ({
    transform: [0, 0],
    from: { transform: [200, 0] },
    width: "100%",
    config: {
      mass: 1,
      tension: 500,
    },
  }));

  const item = data[index];

  const icon = get(item, "publishInfo.icon.type") === "Icon" ? Icons[get(item, "publishInfo.icon.value")] : undefined;

  const messages = useMemo(() => {
    let result = [get(item, "publishInfo.message")];
    const linkifyString = (textData, textToLink, link) =>
      textData.map(msg =>
        ReactStringReplacer(msg, textToLink, (match, i) => (
          <Link key={`${match} ${i}`} href={link}>
            {match}
          </Link>
        ))
      );
    result = get(item, "publishInfo.subject")
      ? flattenDeep(linkifyString(result, get(item, "publishInfo.subject"), get(item, "publishInfo.subjectLink")))
      : result;
    result = get(item, "publishInfo.target")
      ? flattenDeep(linkifyString(result, get(item, "publishInfo.target"), get(item, "publishInfo.targetLink")))
      : result;
    return result;
  }, [item]);

  return (
    <AnimatedListItem
      key={index}
      style={{ ...animateProps, ...style, transform: animateProps.transform.to((x, y) => `translate(${x}px, ${y}px)`) }}
    >
      <Alert
        variant="filled"
        icon={icon}
        severity={get(item, "publishInfo.messageType", "info")}
        style={{ width: "100%", height: 100 }}
      >
        <AlertTitle>
          {messages.map((msg, i) => (isString(msg) ? <span key={`${msg} ${i}`}>{msg}</span> : msg))}
        </AlertTitle>
        {moment(item && item.createdAt).format("MM/DD/YY hh:mm a")}
      </Alert>
    </AnimatedListItem>
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
      <Typography variant="h4" style={{ marginBottom: 8 }}>
        Action Logs
      </Typography>
      <FixedSizeList
        height={300}
        width="100%"
        itemSize={120}
        layout="vertical"
        itemCount={messages.length}
        overscanCount={0}
        itemData={messages}
      >
        {ActionLogRow}
      </FixedSizeList>
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
