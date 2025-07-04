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
}

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
  });

  // Adjust label position based on data.labelPosition
  const getLabelOffset = () => {
    switch (data?.labelPosition) {
      case 'up':
        return -40; // Move label up by 25px
      case 'down':
        return 40; // Move label down by 25px
      default:
        return 0; // Center position
    }
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#6366f1', // indigo-500
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + getLabelOffset()}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className=" border-2 border-indigo-200 px-3 py-2 shadow-lg text-sm font-medium text-gray-800 min-w-[60px] text-center text-wrap max-w-50 bg-indigo-50 rounded-[8px]">
            {data?.label || 'Click to edit'}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default LabeledEdge; 