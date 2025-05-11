// components/CustomNode.tsx
import { Handle, Position } from "@xyflow/react";

interface CustomNodeProps {
  data: {
    type: string;
    label: string;
    targetHandle?: boolean;
    sourceHandle?: boolean;
  };
}
export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div
      className={`whitespace-nowrap p-4 rounded-md shadow-md cursor-pointer transition-colors text-center ${
        data.type === "english"
          ? "bg-white hover:bg-blue-100 text-black border-2 border-blue-500"
          : "bg-white hover:bg-green-50 text-black border-2 border-green-500"
      }`}
    >
      {data.targetHandle && (
        <Handle type="target" position={Position.Left} className="w-3 h-3" />
      )}
      <div className="flex items-center">
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      {data.sourceHandle && (
        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      )}
    </div>
  );
};
