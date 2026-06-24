'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface AvatarProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  // Sync state if src changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc('/placeholder-dev.png');
      }}
      {...props}
    />
  );
};
