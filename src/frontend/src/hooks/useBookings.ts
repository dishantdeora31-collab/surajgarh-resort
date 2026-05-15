import { createActor } from "@/backend";
import type { PublicBookedDate, PublicRoomStatus } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useVenueBookedDates(venueId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PublicBookedDate[]>({
    queryKey: ["venueBookedDates", venueId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVenueBookedDates(venueId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function usePublicRoomStatus(date: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PublicRoomStatus>({
    queryKey: ["publicRoomStatus", date],
    queryFn: async () => {
      if (!actor) {
        return { date, availableCount: BigInt(60), isFullyBooked: false };
      }
      return actor.getPublicRoomStatus(date);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}
