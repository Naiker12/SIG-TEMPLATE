

'use client';

import { NodeProps } from '@xyflow/react';
import { NodeWrapper } from './NodeWrapper';
import { NodeContentRenderer } from './NodeContentRenderer';
import { NODE_CATEGORIES } from '../node-types';

export function InputNode({ data, id }: NodeProps<{ nodeType: string }>) {
  const nodeDef = NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(node => node.type === data.nodeType);

  return (
    <NodeWrapper nodeDef={nodeDef}>
      <NodeContentRenderer id={id} type={data.nodeType} />
    </NodeWrapper>
  );
}
