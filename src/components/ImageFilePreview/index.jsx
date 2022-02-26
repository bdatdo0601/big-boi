import React from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Chip, Avatar, Tooltip } from "@mui/material";

const PREFIX = "index";

const classes = {
  tooltip: `${PREFIX}-tooltip`,
};

const HtmlTooltip = Tooltip;

const StyledHtmlTooltip = styled(HtmlTooltip)(({ theme }) => ({
  [`& .${classes.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));


export default function ImageFilePreview({ onDelete, file }) {
  const name = file.key.split("/")[file.key.split("/").length - 1];
  return (
    <StyledHtmlTooltip
      placement="top"
      title={
        <>
          <img src={file.url} alt={file.name} />
        </>
      }
    >
      <Chip
        className="my-4 mx-2"
        avatar={<Avatar alt={name} src={file.url} />}
        label={name.length > 10 ? `${name.slice(0, 10)}...` : name}
        onDelete={async () => {
          await onDelete();
        }}
      />
    </StyledHtmlTooltip>
  );
}

ImageFilePreview.propTypes = {
  onDelete: PropTypes.func,
  file: PropTypes.object,
};

ImageFilePreview.defaultProps = {
  onDelete: () => {},
  file: {},
};
