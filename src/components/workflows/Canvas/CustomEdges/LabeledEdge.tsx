import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface LabeledEdgeData {
  label?: string;
  labelPosition?: 'up' | 'down' | 'center';
  /**
   * Optional numeric offset in pixels to separate multiple edges between the same pair of nodes.
   * Positive and negative values will shift the path in opposite directions.
   */
  pathOffset?: number;
}

const PARTICLE_COUNT = 10;
const ANIMATION_DURATION = 6;

const LabeledEdge: React.FC<EdgeProps<LabeledEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}) => {
  const { connectedEdges } = useWorkflowStore();
  const isConnected = connectedEdges.includes(id);
  // Use getSmoothStepPath for orthogonal routing with 90-degree angles
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0, // Set to 0 for sharp 90-degree angles
    // If a custom offset is provided via data or derived from label position, apply it
    offset: data?.pathOffset ?? (data?.labelPosition === 'up' ? -20 : data?.labelPosition === 'down' ? 20 : 0),
  });

  // Adjust label position based on data.labelPosition
  const getLabelOffset = () => {
    if (data?.pathOffset !== undefined) {
      // Tie label position to path offset so that it sits nicely beside the edge
      return data.pathOffset * 2;
    }
    switch (data?.labelPosition) {
      case 'up':
        return -40; // Move label up
      case 'down':
        return 40; // Move label down
      default:
        return 0; // Center
    }
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isConnected ? 2.5 : 2,
          stroke: isConnected ? '#4ade80' : '#6366f1', // green-400 for connected (lighter), indigo-500 for normal
          opacity: selected ? 1 : isConnected ? 0.75 : 0.4,
          transition: 'opacity 0.2s, stroke-width 0.2s, stroke 0.2s',
        }} 
      />

      {/* Add animated arrows */}
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <path
          key={`particle-${i}`}
          d="M -6 -6 L 6 0 L -6 6 Z"  // Larger triangle arrow shape
          fill={isConnected ? "#4ade80" : "#6366f1"} // green-400 for connected, indigo-500 for normal
          style={{
            transition: 'opacity 0.2s, fill 0.2s',
            opacity: selected ? 0.9 : isConnected ? 0.6 : 0.25
          }}
        >
          <animateMotion
            dur={`${ANIMATION_DURATION}s`}
            begin={`${(i * ANIMATION_DURATION) / PARTICLE_COUNT}s`}
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"  // Make arrow follow the path direction
          />
        </path>
      ))}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + getLabelOffset()}px)`,
            pointerEvents: 'all',
            // opacity: selected ? 1 : 0.6,
            // transition: 'opacity 0.2s',
          }}
          className="nodrag nopan"
        >
          <div className={`border px-3 py-2 shadow-sm text-sm font-medium min-w-[60px] text-center text-wrap max-w-50 rounded-[8px] ${
            isConnected 
              ? 'text-green-600 border-green-300 bg-green-50' 
              : selected 
                ? 'text-indigo-700 border-indigo-800 bg-indigo-200' 
                : 'text-indigo-400 border-indigo-100 bg-indigo-50'
          }`}>
            {data?.label || 'Click to edit'}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default LabeledEdge; 