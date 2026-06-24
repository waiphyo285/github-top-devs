'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface AvatarProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  return (
    <Image
      src={error ? '/placeholder-dev.png' : src}
      alt={alt}
      className={className}
      onError={() => {
        setError(true);
      }}
      {...props}
    />
  );
};
