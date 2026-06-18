// ArqivaLogo — uses /public/logo.png by default, or a dynamic src from settings
import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'color';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  src?: string;
}

export default function ArqivaLogo({ size = 'md', className = '', src }: LogoProps) {
  const heights = { sm: 60, md: 72, lg: 88 };
  const widths = { sm: 94, md: 180, lg: 220 };

  return (
    <img
      src={src || '/logo.png'}
      alt="ARQIVA Studio & Design"
      style={{ width: widths[size], height: 'auto', maxHeight: heights[size], objectFit: 'contain' }}
      className={className}
    />
  );
}
