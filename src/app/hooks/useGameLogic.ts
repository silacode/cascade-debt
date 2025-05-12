import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  OnNodesChange,
  OnEdgesChange,
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

/**
 * A custom hook that provides the logic for a word matching game using React Flow.
 * It manages the state of nodes and edges, handles user interactions for connecting
 * English words to their French translations, and provides functions to grade the
 * connections and reset the game.
 *
 * The game displays English words on the left and shuffled French words on the right.
 * Users create connections between nodes by clicking an English word to start a
 * connection and a French word to complete it. The hook supports real-time feedback
 * with temporary edges during connection attempts, grading of correct matches, and
 * navigation to a results page.
 *
 * @returns {Object} An object containing the game state and handler functions:
 *
 * @property {Node[]} nodes - The array of nodes for the React Flow graph, representing
 * English and French words.
 *
 * @property {Edge[]} edges - The array of edges for the React Flow graph, representing
 * user-made connections between English and French words.
 *
 * @property {function} onNodesChange - A handler for node state changes, to be passed
 * to the `onNodesChange` prop of the React Flow component.
 *
 * @property {function} onEdgesChange - A handler for edge state changes, to be passed
 * to the `onEdgesChange` prop of the React Flow component.
 *
 * @property {function} onNodeClick - A handler for node click events, to be passed to
 * the `onNodeClick` prop of the React Flow component. Starts a connection on English
 * node clicks and completes it on French node clicks.
 * @param {React.MouseEvent} event - The mouse event triggered by the click.
 * @param {Node} node - The clicked node.
 *
 * @property {function} onPaneClick - A handler for pane click events, to be passed to
 * the `onPaneClick` prop of the React Flow component. Cancels the current connection
 * attempt if one is active.
 *
 * @property {function} handleGrade - A function to evaluate the user's connections,
 * calculate the number of correct matches, and navigate to a results page after a
 * short delay.
 *
 * @property {function} resetGame - A function to reset the game state, clearing all
 * connections, regenerating nodes, and resetting the graded status.
 *
 * @property {boolean} isGraded - A boolean indicating whether the game has been graded.
 *
 * @property {number} correctConnections - The number of correct connections made by
 * the user, derived from the edges.
 *
 * @property {number} total - The total number of word pairs in the game, based on the
 * `wordPairs` data.
 */

export const useGameLogic = (): {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  handleGrade: () => void;
  resetGame: () => void;
  isGraded: boolean;
  correctConnections: number;
  total: number;
} => {
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
