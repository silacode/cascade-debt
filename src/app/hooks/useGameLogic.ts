import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import { wordPairs } from "../data/wordPairs";

const generateNodes = () => {
  const englishNodes = wordPairs.map((p, i) => ({
    id: `en-${p.english}`,
    position: { x: 0, y: i * 80 },
    className: "english-node",
    data: { label: p.english, type: "english", sourceHandle: "right" },
  }));
  const shuffledFrench = [...wordPairs]
    .sort(() => Math.random() - 0.5)
    .map((p, i) => ({
      id: `fr-${p.french}`,
      position: { x: 400, y: i * 80 },
      className: "french-node",
      data: { label: p.french, type: "french", targetHandle: "left" },
    }));
  return [...englishNodes, ...shuffledFrench];
};

export const useGameLogic = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(generateNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGraded, setIsGraded] = useState(false);
  const reactFlowInstance = useReactFlow();
  const router = useRouter();

  const isConnectionCorrect = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);
      if (!sourceNode || !targetNode) return false;
      const pair = wordPairs.find((p) => p.english === sourceNode.data.label);
      return pair?.french === targetNode.data.label;
    },
    [nodes]
  );

  const handleGrade = useCallback(() => {
    const correctCount = edges.filter((e) =>
      isConnectionCorrect(e.source, e.target)
    ).length;
    setIsGraded(true);
    setTimeout(
      () =>
        router.push(`/home?correct=${correctCount}&total=${wordPairs.length}`),
      1000
    );
  }, [edges, router, isConnectionCorrect]);

  const resetGame = useCallback(() => {
    setEdges([]);
    setNodes(generateNodes());
    setIsGraded(false);
  }, [setEdges, setNodes]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.data.type === "temp" || isGraded) return;

      if (!connectionStarted && node.data.type === "english") {
        setConnectionStarted(true);
        setSourceNodeId(node.id);
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, selected: n.id === node.id },
          }))
        );
      } else if (
        connectionStarted &&
        node.id !== sourceNodeId &&
        node.data.type === "french"
      ) {
        const newEdge: Edge = {
          id: `e-${sourceNodeId}-${node.id}`,
          source: sourceNodeId!,
          target: node.id,
          type: "straight",
          style: {
            stroke: isGraded
              ? isConnectionCorrect(sourceNodeId!, node.id)
                ? "#22c55e"
                : "#ef4444"
              : "#3b82f6",
          },
          markerEnd: { type: MarkerType.ArrowClosed },
        };
        setEdges((eds) => [
          ...eds.filter(
            (e) => e.target !== node.id && e.source !== sourceNodeId
          ),
          newEdge,
        ]);
        setConnectionStarted(false);
        setSourceNodeId(null);
        setNodes((nds) =>
          nds.map((n) => ({ ...n, data: { ...n.data, selected: false } }))
        );
      }
    },
    [
      connectionStarted,
      sourceNodeId,
      setNodes,
      setEdges,
      isGraded,
      isConnectionCorrect,
    ]
  );

  const onPaneClick = useCallback(() => {
    if (connectionStarted) {
      setConnectionStarted(false);
      setSourceNodeId(null);
      setNodes((nds) =>
        nds.map((n) => ({ ...n, data: { ...n.data, selected: false } }))
      );
    }
  }, [connectionStarted, setNodes]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!connectionStarted) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setMousePosition(position);
    },
    [connectionStarted, reactFlowInstance]
  );

  useEffect(() => {
    if (!connectionStarted) {
      setNodes((nds) => nds.filter((n) => n.id !== "temp-target"));
      setEdges((eds) => eds.filter((e) => e.id !== "temp-edge"));
      return;
    }

    const tempEdge: Edge = {
      id: "temp-edge",
      source: sourceNodeId!,
      target: "temp-target",
      type: "straight",
      style: { stroke: "#3b82f6" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#3b82f6",
      },
    };
    const tempNode: Node = {
      id: "temp-target",
      position: mousePosition,
      type: "default",
      data: { label: "", targetHandle: "left", type: "temp" },
      style: { opacity: 0, width: 1, height: 1, pointerEvents: "none" },
      selectable: false,
    };
    requestAnimationFrame(() => {
      setNodes((nds) => [
        ...nds.filter((n) => n.id !== "temp-target"),
        tempNode,
      ]);
      setEdges((eds) => [...eds.filter((e) => e.id !== "temp-edge"), tempEdge]);
    });
  }, [connectionStarted, sourceNodeId, mousePosition, setNodes, setEdges]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onPaneClick,
    handleGrade,
    resetGame,
    isGraded,
    correctConnections: edges.filter((e) =>
      isConnectionCorrect(e.source, e.target)
    ).length,
    total: wordPairs.length,
  };
};
