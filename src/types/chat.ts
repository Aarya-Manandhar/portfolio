export type ChatRole = "user" | "assistant";

export interface ChatAction {
  type: "navigate" | "theme";
  target: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Which path produced the answer: rag, llm, retrieval, static, no-match, fallback */
  source?: string;
  /** Semantic retrieval score (e.g. 0.78) */
  topScore?: number;
  /** ID of top chunk retrieved (e.g. 'current_role', 'specsense') */
  topId?: string;
  /** Action executed by copilot */
  action?: ChatAction;
  /** True for client error messages */
  isError?: boolean;
}

/** Shape of the JSON that /api/chat returns */
export interface ChatApiResponse {
  reply: string;
  source: string;
  topScore?: number;
  topId?: string;
}
