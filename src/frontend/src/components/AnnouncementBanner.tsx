import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function AnnouncementBanner() {
  const { siteConfig } = useSiteConfigContext();
  const [dismissed, setDismissed] = useState(false);

  const announcement = siteConfig?.announcement;
  const isVisible = !!announcement?.enabled && !dismissed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-ocid="announcement.banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative z-50 overflow-hidden"
          style={{ background: announcement.bgColor || "oklch(0.22 0.08 55)" }}
        >
          <div className="relative container max-w-6xl mx-auto px-6 py-3 flex items-center justify-center gap-4">
            {/* subtle shimmer line */}
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />
            <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-white text-center leading-snug">
              {announcement.message}
            </span>
            <button
              type="button"
              data-ocid="announcement.close_button"
              aria-label="Dismiss announcement"
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
