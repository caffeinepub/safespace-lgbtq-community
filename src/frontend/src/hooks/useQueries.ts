import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Confession, ContentStatus, UserProfile, ModerationActionType, ContentType, Selector, SwipeStatus } from '../backend';

export function useGetApprovedConfessions(offset = 0, limit = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<Confession[]>({
    queryKey: ['confessions', 'approved', offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedConfessions(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitConfession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitConfession(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
}

export function useReportConfession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ confessionId, reason }: { confessionId: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reportConfession(confessionId, reason);
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReportedConfessions() {
  const { actor, isFetching } = useActor();

  return useQuery<Confession[]>({
    queryKey: ['confessions', 'reported'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReportedConfessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateConfessionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: ContentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateConfessionStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
}

export function useRecordModerationAction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      contentType,
      actionType,
      note,
    }: {
      contentId: bigint;
      contentType: ContentType;
      actionType: ModerationActionType;
      note?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.recordModerationAction(contentId, contentType, actionType, note || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderationActions'] });
    },
  });
}

// Matching hooks
export function useFetchSwipeCandidates() {
  const { actor, isFetching } = useActor();

  return useQuery<Selector[]>({
    queryKey: ['swipeCandidates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchSwipeCandidates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordSwipe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pseudonym: string) => {
      if (!actor) throw new Error('Actor not available');
      const result: SwipeStatus = await actor.recordSwipe(pseudonym);
      return result;
    },
    onSuccess: (data) => {
      // Invalidate candidates to get fresh list
      queryClient.invalidateQueries({ queryKey: ['swipeCandidates'] });
      // If new match was created, invalidate matches list
      if (data.matches && data.matches.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['matches'] });
      }
    },
  });
}

export function useGetUserMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserMatches();
    },
    enabled: !!actor && !isFetching,
  });
}
