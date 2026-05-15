import { createActor } from "@/backend";
import type { Photo } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function usePhotosByCategory(category: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Photo[]>({
    queryKey: ["photos", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPhotosByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}
