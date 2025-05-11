import { ReactFlowProvider } from "@xyflow/react";
import NodeArrow from "./node";

export default function Page() {
  return (
    <main className="w-full h-screen bg-white">
      <ReactFlowProvider>
        <NodeArrow />
      </ReactFlowProvider>
    </main>
  );
}
