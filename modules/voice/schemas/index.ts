export interface StartInterviewRequest {
  setupId?: string;
  role?: string;
  level?: string;
  focusAreas?: string[];
  language?: string;
  maxQuestions?: number;
}

export interface StartInterviewResponse {
  sessionId: string;
  question: string;
}

export interface ProcessTranscriptRequest {
  sessionId: string;
  transcript: string;
}

export interface ProcessTranscriptResponse {
  response: string;
  question?: string;
  isComplete: boolean;
}

export interface EndInterviewRequest {
  sessionId: string;
}

export interface EndInterviewResponse {
  score: number;
  feedback: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface GetInterviewStatusResponse {
  sessionId?: string;
  isActive: boolean;
  messages?: ChatMessage[];
}

export interface GetChatHistoriesResponse {
  histories: ChatMessage[];
  total: number;
}

export interface GetChatHistoriesListResponse {
  histories: Array<{
    sessionId: string;
    createdAt: string;
    messageCount: number;
  }>;
  total: number;
}
