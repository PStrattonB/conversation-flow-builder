// src/types/flow.ts

/**
 * A single step in the conversation flow.
 */
export interface FlowNode {
  /** Unique identifier for the node */
  id: string;

  /** Display label (shown on the canvas) */
  label: string;

  /** What the user says at this step */
  utterance?: string;

  /** Expected chatbot response data */
  expected?: {
    /** Intent returned from chatbot API */
    intent: string;

    /** Key returned from chatbot API */
    key: string;

    /** Expected chatbot reply text */
    bot: string;
  };
}

/**
 * A directional connection between two nodes.
 */
export interface FlowEdge {
  source: string; // ID of the source node
  target: string; // ID of the target node
}

/**
 * A complete conversation flow, suitable for
 * export to YAML/JSON or test generation.
 */
export interface ConversationFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
