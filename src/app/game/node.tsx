"use client";

import { Button } from "@/components/ui/button";
import { ReactFlow } from "@xyflow/react";

import { CustomNode } from "@/components/CustomNode";
import Link from "next/link";
import "@xyflow/react/dist/style.css";
import { useGameLogic } from "../hooks/useGameLogic";

export default function NodeArrow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onPaneClick,
    handleGrade,
    isGraded,
    correctConnections,
    total,
  } = useGameLogic();

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Word Matching Game
        </h1>
        <div className="flex justify-center mb-6 gap-4">
          <Button
            onClick={handleGrade}
            disabled={edges.length === 0 || isGraded}
            className="bg-green-600 hover:bg-green-700"
          >
            Grade
          </Button>
          <Link href="/home">
            <Button variant="outline">Home</Button>
          </Link>
        </div>

        {isGraded && (
          <div className="text-center mb-6" aria-live="polite">
            <p className="text-lg font-medium">
              Your score: {correctConnections} / {total} (
              {Math.round((correctConnections / total) * 100)}%)
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-around mb-4 w-[600px] mx-auto">
        <h2 className="w-[200px] text-center text-xl font-bold text-blue-600">
          English
        </h2>
        <h2 className="w-[200px] text-center text-xl font-bold text-green-600">
          French
        </h2>
      </div>
      <div style={{ height: "calc(100vh - 200px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          fitView
          nodesDraggable={false}
          nodeTypes={{ default: CustomNode }}
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </div>
  );
}
