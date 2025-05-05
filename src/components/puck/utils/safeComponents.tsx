import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Button from "../puckComponents/elements/Button";
import Heading from "../puckComponents/elements/Heading";
import Image from "../puckComponents/elements/Image";
import Text from "../puckComponents/elements/Text";
import { ButtonProps, HeadingProps, ImageProps, TextProps } from "../types";

export const SafeHeading: React.FC<HeadingProps> = (props) => {
  return (
    <ErrorBoundary>
      <Heading {...props} />
    </ErrorBoundary>
  );
};

export const SafeText: React.FC<TextProps> = (props) => (
  <ErrorBoundary>
    <Text {...props} />
  </ErrorBoundary>
);

export const SafeButton: React.FC<ButtonProps> = (props) => (
  <ErrorBoundary>
    <Button {...props} />
  </ErrorBoundary>
);

export const SafeImage: React.FC<ImageProps> = (props) => (
  <ErrorBoundary>
    <Image {...props} />
  </ErrorBoundary>
);
