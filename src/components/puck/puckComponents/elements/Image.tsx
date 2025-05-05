import React from "react";
import { ImageProps } from "../../types";

const Image: React.FC<ImageProps> = ({ src, alt, width, height, objectFit }) => {
  console.log(height,"height of image");
  return (
    <img
      src={src}
      alt={alt}
      style={{ width, height, objectFit }}
    />
  );
};
export default Image;
