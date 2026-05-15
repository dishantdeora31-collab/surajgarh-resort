import { createActor } from "@/backend";
import type { Announcement } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useActiveAnnouncements() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Announcement[]>({
    queryKey: ["activeAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAnnouncements();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
  });
}

export function useAllAnnouncements() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Announcement[]>({
    queryKey: ["allAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}
