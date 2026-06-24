"use client";

import React from "react";

interface FlagImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const FlagImage: React.FC<FlagImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.src !== "/placeholder-flag.png") {
          target.src = "/placeholder-flag.png";
        }
      }}
      {...props}
    />
  );
};
