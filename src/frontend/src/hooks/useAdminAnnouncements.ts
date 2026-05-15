import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddAnnouncement() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      body: string;
      publishDate: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAnnouncement(
        args.title,
        args.body,
        args.publishDate,
        args.isActive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAnnouncements"] });
      qc.invalidateQueries({ queryKey: ["allAnnouncements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      title: string;
      body: string;
      publishDate: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAnnouncement(
        args.id,
        args.title,
        args.body,
        args.publishDate,
        args.isActive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAnnouncements"] });
      qc.invalidateQueries({ queryKey: ["allAnnouncements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAnnouncements"] });
      qc.invalidateQueries({ queryKey: ["allAnnouncements"] });
    },
  });
}
