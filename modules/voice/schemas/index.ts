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

export type ChatRole = "assistant" | "user";

export interface ChatMessage {
  _id: string;
  userId: string;
  sessionId: string;
  language: "vi" | "en" | "de" | "zh";
  metadata: {
    totalMessages: number;
    lastActivity: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  messageCount: number;
  lastMessage: {
    role: ChatRole;
    content: string;
    timestamp: string;
  };
}

export interface GetInterviewStatusResponse {
  sessionId?: string;
  isActive: boolean;
  messages?: ChatMessage[];
}

export interface GetChatHistoriesResponse {
  histories: ChatMessage[];
  total: number;
  limit: 20;
  offset: 0;
}

export interface GetSessionHistoryResponse {
  histories: [
    {
      metadata: {
        totalMessages: number;
        lastActivity: string;
      };
      _id: string;
      userId: string;
      sessionId: string;
      messages: {
        role: ChatRole;
        content: string;
        timestamp: string;
      }[];
      language: "vi" | "en" | "de" | "zh";
      createdAt: string;
      updatedAt: string;
      __v: number;
    },
  ];
  total: number;
  limit: number;
  offset: number;
  sessionId: string;
}
