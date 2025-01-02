import React from "react";
import { ImageProps } from "../../types";

const Image: React.FC<ImageProps> = ({ src, alt, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="max-w-full h-auto"
    />
  );
};

export default Image;
