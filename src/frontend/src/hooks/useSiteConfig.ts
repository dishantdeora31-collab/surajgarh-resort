// useSiteConfig — stub (getSiteConfig/updateSiteConfig removed in Surajgarh Resort backend)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSiteConfig(): {
  siteConfig: Record<string, any> | undefined;
  isLoading: boolean;
  isError: boolean;
  updateSiteConfig: (c: Record<string, any>) => Promise<Record<string, any>>;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: boolean;
} {
  return {
    siteConfig: undefined,
    isLoading: false,
    isError: false,
    updateSiteConfig: async (c) => c,
    isSaving: false,
    saveSuccess: false,
    saveError: false,
  };
}
