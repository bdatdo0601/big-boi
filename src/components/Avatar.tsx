import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, width = 50, height = 50 }) => {
  const firstLetter = alt.charAt(0).toUpperCase();

  return src ? (
    <img
      src={src}
      alt={alt}
      className={`rounded-full flex justify-center items-center border-input border-2`}
      style={{
        width, height
      }}
    />
  ) : (
    <span className={`rounded-full bg-secondary flex justify-center items-center font-normal border-input border-2`} style={{
      width, height,
      fontSize: `${Math.min(width, height) * 0.4}px`,
    }}>
      {firstLetter}
    </span>
  )
};

export default Avatar;
