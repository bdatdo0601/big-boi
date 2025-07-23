import Facebook from '@mui/icons-material/Facebook';
import GitHub from '@mui/icons-material/GitHub';
import Info from '@mui/icons-material/Info';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Mail from '@mui/icons-material/Mail';
import Phone from '@mui/icons-material/Phone';
import Twitter from '@mui/icons-material/Twitter';
import React from 'react';

const IconMapper: Record<string, React.ComponentType> = {
  GitHub,
  LinkedIn,
  Email: Mail,
  Phone,
  Twitter,
  Instagram,
  Facebook,
};

interface IconProps {
  href: string;
  type: string;
  value: string;
  fontSize?: number;
}

const Icon: React.FC<IconProps> = ({ href, value, fontSize }) => {
  const Icon: any = IconMapper[value] || Info;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="border-none">
      <Icon sx={{ fontSize: fontSize || 24 }} />
    </a>
  );
};

export default Icon;
