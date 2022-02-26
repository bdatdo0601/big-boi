import React, { useMemo } from "react";
import PropTypes from "prop-types";
import MarkdownIt from "markdown-it";
import MarkdownItHighlightJSPlugins from "markdown-it-highlightjs";
import htmlParser from "html-react-parser";

import "./index.less";

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */).use(MarkdownItHighlightJSPlugins);

export default function MarkdownDisplayer({ value, ...props }) {
  const postContentRawHTML = useMemo(() => mdParser.render(value), [value]);

  return <div {...props}>{htmlParser(postContentRawHTML)}</div>;
}

MarkdownDisplayer.propTypes = {
  value: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

MarkdownDisplayer.defaultProps = {
  value: "",
  style: {},
  className: "retro",
};
