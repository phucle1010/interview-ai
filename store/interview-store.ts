import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InterviewMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface InterviewState {
  sessionId: string | null;
  setupId: string | null;
  isActive: boolean;
  isProcessing: boolean;
  currentQuestion: string | null;
  messages: InterviewMessage[];
  language: string | null;
  setSession: (sessionId: string, setupId: string, language: string) => void;
  addMessage: (message: Omit<InterviewMessage, "id" | "timestamp">) => void;
  setCurrentQuestion: (question: string | null) => void;
  setProcessing: (processing: boolean) => void;
  setActive: (active: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      sessionId: null,
      setupId: null,
      isActive: false,
      isProcessing: false,
      currentQuestion: null,
      messages: [],
      language: null,
      setSession: (sessionId, setupId, language) => {
        set({ sessionId, setupId, language, isActive: true });
      },
      addMessage: (message) => {
        const newMessage: InterviewMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      setCurrentQuestion: (question) => {
        set({ currentQuestion: question });
      },
      setProcessing: (processing) => {
        set({ isProcessing: processing });
      },
      setActive: (active) => {
        set({ isActive: active });
      },
      reset: () => {
        set({
          sessionId: null,
          setupId: null,
          isActive: false,
          isProcessing: false,
          currentQuestion: null,
          messages: [],
          language: null,
        });
      },
    }),
    {
      name: "interview-storage",
    }
  )
);
