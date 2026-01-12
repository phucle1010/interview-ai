import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { voiceService } from "@/modules/voice/services/voice.service";
import type {
  StartInterviewRequest,
  ProcessTranscriptRequest,
  EndInterviewRequest,
  GetChatHistoriesResponse,
} from "@/modules/voice/schemas";
import { interviewService } from "@/modules/interview/services/interview.service";

export function useStartInterview() {
  return useMutation({
    mutationFn: (data: StartInterviewRequest) => voiceService.start(data),
  });
}

export function useProcessTranscript() {
  return useMutation({
    mutationFn: (data: ProcessTranscriptRequest) => voiceService.process(data),
  });
}

export function useEndInterview() {
  return useMutation({
    mutationFn: (data: EndInterviewRequest) => voiceService.end(data),
  });
}

export function useSessionHistory(sessionId: string | null) {
  return useQuery({
    queryKey: ["session-history", sessionId],
    queryFn: () => voiceService.getSessionHistory(sessionId!),
    enabled: !!sessionId,
  });
}

export function useInterviewStatus() {
  return useQuery({
    queryKey: ["voice", "interview-status"],
    queryFn: () => voiceService.getInterviewStatus(),
  });
}

export function useChatHistories(
  userId: string | null,
  options?: { limit?: number; offset?: number }
) {
  return useQuery({
    queryKey: ["voice", "history", userId, options],
    queryFn: () => voiceService.getChatHistories(userId!, options),
    enabled: !!userId,
  });
}

export function useChatHistory(options?: {
  userId?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["voice", "history", options],
    queryFn: () => voiceService.getChatHistory(options),
  });
}

export function useChatHistoriesList(options?: {
  limit?: number;
  offset?: number;
  sessionId?: string;
}) {
  return useQuery({
    queryKey: ["voice", "histories", options],
    queryFn: () => voiceService.getChatHistoriesList(options),
  });
}

export function useChatHistoriesListInfinite(options?: { sessionId?: string }) {
  const limit = 20;

  return useInfiniteQuery({
    queryKey: ["voice", "histories", "infinite", options],
    queryFn: ({ pageParam = 0 }) =>
      voiceService.getChatHistoriesList({
        limit,
        offset: pageParam,
        sessionId: options?.sessionId,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.data?.histories?.length || 0),
        0
      );
      if (loaded < (lastPage.data?.total || 0)) {
        return loaded;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
  // const limit = 20;

  // const [total, setTotal] = useState<number>(0);

  // const {
  //   data: histories,
  //   isLoading,
  //   isError,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   refetch,
  // } = useInfiniteQuery<GetChatHistoriesResponse, number>({
  //   queryKey: ["voice", "histories", "infinite", options],
  //   queryFn: async ({ pageParam = 0 }) => {
  //     try {
  //       const response = await voiceService.getChatHistoriesList({
  //         limit,
  //         offset: pageParam as number,
  //         sessionId: options?.sessionId,
  //       });

  //       if (response.data?.histories) {
  //         setTotal(response.data.total);

  //         const hasMore =
  //           limit + response.data.histories.length < response.data.total;
  //         const nextPageParam = hasMore
  //           ? limit + response.data.histories.length
  //           : undefined;

  //         return {
  //           histories: response.data.histories,
  //           total: response.data.total,
  //           limit: limit,
  //           offset: nextPageParam as number,
  //         };
  //       }

  //       return {
  //         histories: [],
  //         total: 0,
  //         limit: limit,
  //         offset: 0,
  //       };
  //     } catch (err) {
  //       console.error("Failed to fetch chat histories", err);
  //       throw err;
  //     }
  //   },
  //   initialPageParam: 0,
  //   getNextPageParam: (lastPage, allPages) => {
  //     if (lastPage.histories.length < limit) {
  //       return undefined;
  //     }
  //     const totalFetched = allPages.flat().length;
  //     return totalFetched;
  //   },
  // });

  // return {
  //   histories,
  //   total,
  //   isLoading,
  //   isError,
  //   error: error as Error | null,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   refetch,
  // };
}

export function useDeleteChatHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => voiceService.deleteChatHistory(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice", "history"] });
      queryClient.invalidateQueries({ queryKey: ["voice", "histories"] });
    },
  });
}

export function useGetInterviewStatus() {
  return useQuery({
    queryKey: ["interview-status"],
    queryFn: () => voiceService.getInterviewStatus(),
  });
}
