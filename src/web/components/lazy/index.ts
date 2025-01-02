import { lazy } from 'react';

export const LazyColorPicker = lazy(() => import('../ColorPicker'));
export const LazySpacingPicker = lazy(() => import('../SpacingPicker'));
export const LazyHeading = lazy(() => import('../elements/Heading'));

// Add more lazy-loaded components as needed
