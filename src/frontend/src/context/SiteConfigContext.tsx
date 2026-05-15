// SiteConfigContext — stub (SiteConfig backend type removed in Surajgarh Resort)
import { createContext, useContext } from "react";

interface SiteConfigContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteConfig: Record<string, any> | undefined;
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSiteConfig: (
    config: Record<string, any>,
  ) => Promise<Record<string, any>>;
  isSaving: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({
  children,
}: { children: React.ReactNode }) {
  const value: SiteConfigContextValue = {
    siteConfig: undefined,
    isLoading: false,
    isError: false,
    updateSiteConfig: async (c) => c,
    isSaving: false,
  };
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfigContext(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx)
    throw new Error(
      "useSiteConfigContext must be used within SiteConfigProvider",
    );
  return ctx;
}
