// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";

// import {
//   ReactFlow,
//   useNodesState,
//   useEdgesState,
//   useReactFlow,
//   addEdge,
//   Handle,
//   Position,
//   Edge,
//   Node,
//   MarkerType,
// } from "@xyflow/react";

// import "@xyflow/react/dist/style.css";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// // Word pairs for matching
// const wordPairs = [
//   { english: "bicycle", french: "vélo" },
//   { english: "railroad", french: "chemin de fer" },
//   { english: "folder", french: "dossier" },
//   { english: "butter", french: "beurre" },
//   { english: "cereal", french: "céréale" },
//   { english: "hungry", french: "faim" },
//   { english: "forest", french: "forêt" },
//   { english: "camel", french: "chameau" },
//   { english: "weekly", french: "hebdomadaire" },
//   { english: "desk", french: "bureau" },
//   { english: "sibling", french: "frère et sœur" },
//   { english: "limestone", french: "calcaire" },
// ];

// // Modify the initialNodes creation to randomize French words
// const generateNodes = () => {
//   // Create English nodes first
//   const englishNodes = wordPairs.map((p, index) => ({
//     id: `${index}-en`,
//     position: { x: 0, y: index * 80 },
//     className: "english-node",
//     data: {
//       label: p.english,
//       type: "english",
//       sourceHandle: "right",
//     },
//   }));

//   // Create French nodes with randomized order
//   const shuffledFrench = [...wordPairs]
//     .sort(() => Math.random() - 0.5)
//     .map((p, index) => ({
//       id: `${index}-fr`,
//       position: { x: 400, y: index * 80 },
//       className: "french-node",
//       data: {
//         label: p.french,
//         type: "french",
//         targetHandle: "left",
//       },
//     }));

//   // Combine both arrays
//   return [...englishNodes, ...shuffledFrench];
// };

// const CustomNode = ({ data, id }) => {
//   return (
//     <div
//       className={`whitespace-nowrap p-4 rounded-md shadow-md cursor-pointer transition-colors text-center ${
//         data.type === "english"
//           ? "bg-white hover:bg-blue-100 text-black border-2 border-blue-500"
//           : "bg-white hover:bg-green-50 text-black border-2 border-green-500"
//       }`}
//     >
//       {data.targetHandle && (
//         <Handle type="target" position={Position.Left} className="w-3 h-3" />
//       )}
//       <div className="flex items-center">
//         <div className="text-lg font-bold">{data.label}</div>
//       </div>
//       {data.sourceHandle && (
//         <Handle type="source" position={Position.Right} className="w-3 h-3" />
//       )}
//     </div>
//   );
// };

// export default function NodeArrow() {
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node>(generateNodes());
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
//   const [connectionStarted, setConnectionStarted] = useState(false);
//   const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isCheckMode, setIsCheckMode] = useState(false);
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const reactFlowInstance = useReactFlow();
//   const router = useRouter();

//   // Check if a connection is correct
//   const isConnectionCorrect = (sourceId: string, targetId: string) => {
//     // Extract indices from node IDs (format: "index-en" or "index-fr")
//     const englishIndex = parseInt(sourceId.split("-")[0]);

//     const targetNode = nodes.find((n) => n.id === targetId);
//     if (!targetNode) return false;
//     const targetLabel = targetNode.data.label;

//     // Check if they form a correct pair
//     return wordPairs[englishIndex].french === targetLabel;
//   };

//   // Calculate score based on the actual edges
//   const correctConnections = isCheckMode
//     ? edges.filter((edge) => isConnectionCorrect(edge.source, edge.target))
//         .length
//     : 0;

//   const handleGrade = () => {
//     const correctCount = edges.filter((edge) =>
//       isConnectionCorrect(edge.source, edge.target)
//     ).length;
//     const total = wordPairs.length;
//     router.push(`/home?correct=${correctCount}&total=${total}`);
//   };

//   const onConnect = useCallback(
//     (params) =>
//       setEdges((eds) => addEdge({ ...params, type: "straight" }, eds)),
//     [setEdges]
//   );

//   // Handle mouse move to update the temporary edge
//   useEffect(() => {
//     if (!connectionStarted || !reactFlowWrapper.current) return;

//     const handleMouseMove = (event: MouseEvent) => {
//       const position = reactFlowInstance.screenToFlowPosition({
//         x: event.clientX,
//         y: event.clientY,
//       });
//       setMousePosition(position);
//       // }
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, [connectionStarted, reactFlowInstance]);

//   // Create a temporary edge when connection is started
//   useEffect(() => {
//     if (!connectionStarted || !sourceNodeId) {
//       // Remove temporary edge and node when connection is ended
//       setNodes((nds) => nds.filter((n) => n.id !== "temp-target"));
//       setEdges((eds) => eds.filter((e) => e.id !== "temp-edge"));
//       return;
//     }

//     // Create a temporary edge that follows the mouse
//     const tempEdge: Edge = {
//       id: "temp-edge",
//       source: sourceNodeId,
//       target: "temp-target",
//       type: "default",
//       animated: false,
//       style: { stroke: "#3b82f6" },
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 20, // Increased from default
//         height: 20, // Increased from default
//         color: "#3b82f6", // Match the edg
//       },
//     };

//     // Add a temporary invisible node at mouse position
//     const tempNode: Node = {
//       id: "temp-target",
//       position: mousePosition,
//       type: "default",
//       data: { label: "", targetHandle: "left", type: "temp" },
//       style: { opacity: 0, width: 1, height: 1, pointerEvents: "none" },
//       selectable: false,
//     };

//     // Use requestAnimationFrame for smooth edge updates
//     requestAnimationFrame(() => {
//       setNodes((nds) => {
//         // Filter out any existing temp node
//         const filteredNodes = nds.filter((n) => n.id !== "temp-target");
//         return [...filteredNodes, tempNode];
//       });

//       setEdges((eds) => {
//         // Filter out any existing temp edge
//         const filteredEdges = eds.filter((e) => e.id !== "temp-edge");
//         return [...filteredEdges, tempEdge];
//       });
//     });
//   }, [connectionStarted, sourceNodeId, mousePosition, setNodes, setEdges]);

//   // Handle node click to start or end connection
//   const onNodeClick = useCallback(
//     (event: React.MouseEvent, node: Node) => {
//       // Skip if clicking the temporary node
//       if (node.id === "temp-target") return;

//       // Get the node type from the data
//       const nodeType = node.data.type;
//       console.log(nodeType);

//       if (!connectionStarted) {
//         // Start connection
//         // Only allow starting connection from English nodes
//         if (nodeType === "english") {
//           setConnectionStarted(true);
//           setSourceNodeId(node.id);

//           // Highlight the selected node
//           setNodes((nds) =>
//             nds.map((n) => ({
//               ...n,
//               data: {
//                 ...n.data,
//                 selected: n.id === node.id,
//               },
//             }))
//           );
//         }
//       } else if (node.id !== sourceNodeId && nodeType === "french") {
//         // // Only allow ending connection on French nodes
//         // if (nodeType === "french") {
//         // End connection on a different node
//         const newEdge = {
//           id: `e${sourceNodeId}-${node.id}`,
//           source: sourceNodeId!,
//           target: node.id,
//           type: "straight",
//           animated: false,
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//           },
//         };

//         // Reset states first
//         setConnectionStarted(false);
//         setSourceNodeId(null);

//         // Then update the edges and nodes
//         // requestAnimationFrame(() => {
//         // Add the new edge
//         setEdges((eds) => {
//           const filteredEdges = eds.filter(
//             (e) =>
//               e.id !== "temp-edge" &&
//               e.target !== node.id &&
//               e.source !== sourceNodeId
//           );
//           return [...filteredEdges, newEdge];
//         });

//         // Remove highlights
//         setNodes((nds) =>
//           nds.map((n) => ({
//             ...n,
//             data: {
//               ...n.data,
//               selected: false,
//             },
//           }))
//         );
//         //  });
//       }
//     },
//     [connectionStarted, sourceNodeId, setNodes, setEdges]
//   );

//   // Handle background click to cancel connection
//   const onPaneClick = useCallback(() => {
//     if (connectionStarted) {
//       // Cancel connection
//       setConnectionStarted(false);
//       setSourceNodeId(null);

//       // Remove highlights
//       setNodes((nds) =>
//         nds.map((n) => ({
//           ...n,
//           data: {
//             ...n.data,
//             selected: false,
//           },
//         }))
//       );
//     }
//   }, [connectionStarted, setNodes]);

//   // Reset the game
//   const resetGame = () => {
//     setEdges([]);
//     setIsCheckMode(false);
//   };

//   return (
//     <div className="min-h-screen p-4 flex flex-col">
//       <div className="mb-4">
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Word Matching Game
//         </h1>
//         <div className="flex justify-center mb-6 gap-4">
//           <Button
//             // onClick={() => setIsCheckMode(true)}
//             // disabled={isCheckMode || edges.length === 0}
//             onClick={handleGrade}
//             disabled={edges.length === 0}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             Grade
//           </Button>
//           <Button onClick={resetGame} variant="outline">
//             <Link href={"/home"}>Home</Link>
//           </Button>
//         </div>

//         {isCheckMode && (
//           <div className="text-center mb-6">
//             <p className="text-lg font-medium">
//               Your score: {correctConnections} / {wordPairs.length} (
//               {Math.round((correctConnections / wordPairs.length) * 100)}%)
//             </p>
//           </div>
//         )}
//       </div>
//       <div
//         //className="flex-1 relative"
//         ref={reactFlowWrapper}
//         style={{ height: "calc(100vh - 200px)" }}
//       >
//         <div className="flex justify-around mb-4 w-[600px] mx-auto">
//           <div className="w-[200px] text-center">
//             <h2 className="text-xl font-bold text-blue-600">English</h2>
//           </div>
//           <div className="w-[200px] text-center">
//             <h2 className="text-xl font-bold text-green-600">French</h2>
//           </div>
//         </div>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onNodeClick={onNodeClick}
//           onPaneClick={onPaneClick}
//           onConnect={onConnect}
//           panOnDrag={false}
//           zoomOnScroll={false}
//           zoomOnPinch={false}
//           zoomOnDoubleClick={false}
//           fitView
//           nodesDraggable={false}
//           nodeTypes={{ default: CustomNode }}
//           proOptions={{ hideAttribution: true }}
//           style={{ padding: 0! }}
//         />
//       </div>
//     </div>
//   );
// }

// app/game/node.tsx
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
          <Button variant="outline">
            <Link href="/home">Home</Link>
          </Button>
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
