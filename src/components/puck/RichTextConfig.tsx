import React from 'react';
import { PuckRichText } from "@tohuhono/puck-rich-text";
import { RichTextWrapper } from './RichTextWrapper';

// Export the config for use in PuckConfig
const RichTextConfig = {
  ...PuckRichText,
  render: (props: Record<string, unknown>) => <RichTextWrapper {...props} />
};

export default RichTextConfig;
