import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSiteContent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSiteContent(key, value);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allSiteContent"] });
      qc.invalidateQueries({ queryKey: ["siteContent"] });
    },
  });
}

export function useVerifyAdminPassword() {
  const { actor } = useActor(createActor);
  return async (password: string): Promise<boolean> => {
    if (!actor) return false;
    return actor.verifyAdminPassword(password);
  };
}
