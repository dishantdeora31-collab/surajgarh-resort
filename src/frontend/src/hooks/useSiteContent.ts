import { createActor } from "@/backend";
import type { ContentRecord } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useAllSiteContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContentRecord[]>({
    queryKey: ["allSiteContent"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteContent(key: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContentRecord | null>({
    queryKey: ["siteContent", key],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteContent(key);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContentMap() {
  const { data: records = [] } = useAllSiteContent();
  const map: Record<string, string> = {};
  for (const r of records) map[r.key] = r.value;
  return {
    get: (key: string) => map[key] ?? "",
    map,
  };
}
