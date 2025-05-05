/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";
import { lazy } from "react";

export const LazyColorPicker = lazy(() =>
  import("../ColorPicker").then((module) => ({
    default: module.default as ComponentType<any>,
  }))
);

export const LazySpacingPicker = lazy(() =>
  import("../SpacingPicker").then((module) => ({
    default: module.default as ComponentType<any>,
  }))
);

export const LazyHeading = lazy(() =>
  import("../elements/Heading").then((module) => ({
    default: module.default as ComponentType<any>,
  }))
);

// Add more lazy-loaded components as needed
