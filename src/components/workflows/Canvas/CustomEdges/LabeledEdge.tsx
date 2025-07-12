import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';

interface LabeledEdgeData {
  label?: string;
  labelPosition?: 'up' | 'down' | 'center';
  /**
   * Optional numeric offset in pixels to separate multiple edges between the same pair of nodes.
   * Positive and negative values will shift the path in opposite directions.
   */
  pathOffset?: number;
}

const PARTICLE_COUNT = 6;
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
}) => {
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
      {/* Define gradient for particles */}
      <defs>
        <linearGradient id="particle-gradient" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#6366f1', // indigo-500
        }} 
      />

      {/* Add animated particles */}
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <circle
          key={`particle-${i}`}
          r={3.5}
          fill="url(#particle-gradient)"
        >
          <animateMotion
            dur={`${ANIMATION_DURATION}s`}
            begin={`${(i * ANIMATION_DURATION) / PARTICLE_COUNT}s`}
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      ))}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + getLabelOffset()}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="border-2 border-indigo-200 px-3 py-2 shadow-lg text-sm font-medium text-gray-800 min-w-[60px] text-center text-wrap max-w-50 bg-indigo-50 rounded-[8px]">
            {data?.label || 'Click to edit'}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default LabeledEdge; 