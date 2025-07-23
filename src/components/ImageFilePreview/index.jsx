import Delete from '@mui/icons-material/Delete';
import { Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '../Avatar';

const PREFIX = 'index';

const classes = {
  tooltip: `${PREFIX}-tooltip`,
};

const HtmlTooltip = Tooltip;

const StyledHtmlTooltip = styled(HtmlTooltip)(({ theme }) => ({
  [`& .${classes.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default function ImageFilePreview({ onDelete, file }) {
  const name = file.key.split('/')[file.key.split('/').length - 1];
  return (
    <StyledHtmlTooltip placement="top" title={<img src={file.url} alt={file.name} />}>
      <div className="bg-muted rounded-full flex flex-nowrap gap-2 items-center pr-2">
        <Avatar src={file.url} alt={name} width={80} height={80} />
        <span className="text-wrap max-sm:hidden">{name}</span>
        <button
          className="hover:cursor-pointer"
          onClick={async e => {
            e.preventDefault();
            await onDelete();
          }}
        >
          <Delete sx={{ color: 'var(--destructive)' }} />
        </button>
      </div>
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
