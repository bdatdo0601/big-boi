import React from 'react';

interface ChipButtonProps {
  url?: string;
  label: string;
  icon?: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  className?: string;
}

export const ChipButton: React.FC<ChipButtonProps> = ({
  url,
  label,
  icon,
  bgColor = 'secondary',
  onClick,
  className,
}) => {
  const defaultClassName = `text-xs flex items-center justify-start flex-row gap-1 text-secondary-foreground bg-${bgColor} shadow-lg rounded-lg px-2 py-0.5 hover:cursor-pointer`;

  return (
    <button
      className={className || defaultClassName}
      key={label}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (url) {
          window.open(url, '_blank');
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
