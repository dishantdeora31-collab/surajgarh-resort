import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddPhoto() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      category: string;
      url: string;
      caption: string;
      mediaType?: string;
      thumbnailUrl?: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addPhoto(
        args.category,
        args.url,
        args.caption,
        args.mediaType ?? "image",
        args.thumbnailUrl ?? null,
      );
    },
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["photos", v.category] }),
  });
}

export function useDeletePhoto() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; category: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePhoto(args.id);
    },
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["photos", v.category] }),
  });
}
export function useReorderGalleryMedia() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: bigint[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.reorderGalleryMedia(orderedIds);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}
