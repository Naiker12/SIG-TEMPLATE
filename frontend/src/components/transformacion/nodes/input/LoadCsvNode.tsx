
'use client';
import { BaseNode } from '../BaseNode';
import type { NodeProps } from '@xyflow/react';

// This is the visual component for the node on the canvas.
// The actual configuration UI is in a separate sheet component.
export const LoadCsvNode = (props: NodeProps) => {
  return <BaseNode {...props} />;
};
