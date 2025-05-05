import React from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import { usePuck } from "../../packages/measured/puck";

// This is a component that will safely wrap PuckRichText
// It can be used as a fallback when the component might render outside the Puck context
export const RichTextWrapper: React.FC<Record<string, unknown>> = (props) => {
  // Check if we're in a Puck context
  let isPuckContext = true;

  try {
    // This will throw an error if outside of Puck context
    usePuck();
  } catch {
    isPuckContext = false;
  }

  if (!isPuckContext) {
    // If not in Puck context, render a placeholder
    return (
      <ErrorBoundary>
        <div className="p-4 border border-dashed border-gray-300 bg-gray-50 text-gray-500 text-center">
          Rich Text Editor (only available in editor mode)
        </div>
      </ErrorBoundary>
    );
  }

  // In Puck context, render a div as a placeholder for now
  // The actual content will be handled by Puck
  return (
    <ErrorBoundary>
      <div {...props} />
    </ErrorBoundary>
  );
};
