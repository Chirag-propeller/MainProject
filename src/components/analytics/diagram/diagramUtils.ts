// components/Diagram/diagramUtils.ts

const MAX_HEIGHT = 150;
const MIN_HEIGHT = 40;

export function getHeight(count: number, total: number): number {
  const scaled = (count / total) * MAX_HEIGHT;
  return Math.max(scaled, MIN_HEIGHT);
}

export function isConnected(
  nodeId: string,
  selectedNodeId: string,
  edges: { source: string; target: string }[]
): boolean {
  if (!selectedNodeId) return true;
  return (
    nodeId === selectedNodeId ||
    edges.some((e) => (e.source === selectedNodeId && e.target === nodeId) || (e.target === selectedNodeId && e.source === nodeId))
  );
}
