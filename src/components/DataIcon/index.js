import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as Icons from "@mui/icons-material";
import { Link } from "@mui/material";
import { capitalize } from "lodash";

const DataIcon = ({ type, value, href, alt }) => {
  const Icon = Icons[value] || Icons[capitalize(value)];
  const style = useMemo(() => ({ width: 24, height: 24, maxWidth: 24 }), []);
  switch (type) {
    case "Icon":
    case "icon":
      return href ? (
        <Link href={href} style={{}}>
          {Icon && <Icon />}
        </Link>
      ) : (
        Icon && <Icon />
      );
    case "image_data":
      return href ? (
        <Link href={href} style={style}>
          <img src={value} alt={alt} style={style} />
        </Link>
      ) : (
        <img src={value} alt={alt} style={style} />
      );
    default:
      return <DataIcon type="Icon" value="Info" />;
  }
};

DataIcon.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  href: PropTypes.string,
  alt: PropTypes.string,
};

DataIcon.defaultProps = {
  value: "Info",
  href: undefined,
  alt: "Icons",
};

export default DataIcon;
