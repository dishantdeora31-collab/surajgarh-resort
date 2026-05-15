interface CustomContentBlock {
  id: string;
  blockType: string;
  title: string;
  content: string;
  url?: string;
  targetSection?: string;
  order: bigint;
}
import SectionHeader from "@/components/SectionHeader";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { worldRegions } from "@/data/gameData";
import type { Region } from "@/types/game";
import { Download, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    /* ignore */
  }
  const m = url.match(/(?:v=|youtu\.be\/)?([\w-]{11})/);
  return m ? m[1] : null;
}

function RegionInlineBlock({ block }: { block: CustomContentBlock }) {
  return (
    <div
      className="mt-3 rounded-lg overflow-hidden p-4 flex flex-col gap-3"
      style={{
        background: "oklch(0.13 0.02 270 / 0.6)",
        border: "1px solid oklch(0.28 0.06 60 / 0.25)",
      }}
    >
      {block.title && (
        <h4 className="font-display font-semibold text-sm text-foreground/90">
          {block.title}
        </h4>
      )}
      {block.blockType === "paragraph" && block.content && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {block.content}
        </p>
      )}
      {block.blockType === "image" && block.url && (
        <img
          src={block.url}
          alt={block.title || ""}
          className="w-full h-auto rounded-md max-h-56 object-cover"
        />
      )}
      {block.blockType === "video" &&
        block.url &&
        (() => {
          const vid = extractYouTubeId(block.url);
          return vid ? (
            <div
              className="relative w-full rounded-md overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${vid}`}
                title={block.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline flex items-center gap-1"
            >
              <Video className="w-3.5 h-3.5" /> Watch Video
            </a>
          );
        })()}
      {block.blockType === "file" && block.url && (
        <a
          href={block.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-display font-semibold transition-smooth"
          style={{ color: "oklch(0.75 0.22 55)" }}
        >
          <Download className="w-3.5 h-3.5" /> Download File
        </a>
      )}
      {block.content && block.blockType !== "paragraph" && (
        <p className="text-muted-foreground text-xs">{block.content}</p>
      )}
    </div>
  );
}

const regionBgs: Record<string, string> = {
  "fallen-earth":
    "linear-gradient(160deg, oklch(0.28 0.10 25) 0%, oklch(0.18 0.06 35) 50%, oklch(0.10 0 0) 100%)",
  "cursed-wilderness":
    "linear-gradient(160deg, oklch(0.20 0.09 140) 0%, oklch(0.15 0.05 150) 50%, oklch(0.10 0 0) 100%)",
  "ashen-realms":
    "linear-gradient(160deg, oklch(0.32 0.14 35) 0%, oklch(0.22 0.10 48) 50%, oklch(0.12 0 0) 100%)",
  "celestial-frontier":
    "linear-gradient(160deg, oklch(0.24 0.12 200) 0%, oklch(0.17 0.07 215) 50%, oklch(0.10 0 0) 100%)",
  heaven:
    "linear-gradient(160deg, oklch(0.45 0.18 60) 0%, oklch(0.30 0.12 55) 50%, oklch(0.15 0.04 60) 100%)",
};

const regionIcons: Record<string, string> = {
  "fallen-earth": "🏚",
  "cursed-wilderness": "🌲",
  "ashen-realms": "🌋",
  "celestial-frontier": "✦",
  heaven: "👑",
};

function RegionCard({
  region,
  index,
  isActive,
  onClick,
}: { region: Region; index: number; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      data-ocid={`regions.card.${index + 1}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.04 }}
      onClick={onClick}
      className="relative rounded-xl overflow-hidden border text-left cursor-pointer transition-smooth aspect-[3/4]"
      style={{
        borderColor: isActive ? region.color : "oklch(0.24 0 0)",
        boxShadow: isActive
          ? `0 0 30px ${region.color}44, 0 0 60px ${region.color}22`
          : "none",
      }}
    >
      {/* Layered bg gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            regionBgs[region.id] ??
            `radial-gradient(ellipse at 50% 30%, ${region.color} 0%, oklch(0.10 0 0) 70%)`,
        }}
      />
      {/* Ambient radial overlay */}
      <div
        className="absolute inset-0 transition-smooth"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${region.color}55 0%, transparent 65%)`,
          opacity: isActive ? 1 : 0.4,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

      {/* Icon */}
      <div className="absolute top-3 right-3 text-xl opacity-60">
        {regionIcons[region.id]}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 gap-1">
        <p
          className="text-[10px] font-display font-semibold tracking-[0.15em] uppercase"
          style={{ color: region.color }}
        >
          {region.atmosphere}
        </p>
        <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
          {region.name}
        </h3>
      </div>
    </motion.button>
  );
}

export default function RegionsSection() {
  const { siteConfig } = useSiteConfigContext();
  // Merge siteConfig worldRegions with frontend visual data
  const regions: Region[] = siteConfig?.worldRegions?.length
    ? siteConfig.worldRegions.map((r) => {
        const base = worldRegions.find((wr) => wr.id === r.id);
        return {
          id: r.id,
          name: r.name,
          description: r.description,
          features: r.features,
          atmosphere: base?.atmosphere ?? "Explore",
          color: base?.color ?? "oklch(0.65 0.22 60)",
          accentColor: base?.accentColor ?? "#d4af37",
        };
      })
    : worldRegions;
  const [activeRegion, setActiveRegion] = useState<string>("fallen-earth");
  const region = regions.find((r) => r.id === activeRegion) ?? regions[0];

  const regionInlineBlocks = (siteConfig?.customContent ?? [])
    .filter((b) => b.targetSection === activeRegion)
    .sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <section
      id="regions"
      data-ocid="regions.section"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none transition-smooth"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${region.color} 0%, transparent 70%)`,
        }}
      />

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Open World"
          title="Regions Explorer"
          subtitle="Five massive regions — each a universe unto itself. No loading screens. No boundaries. Explore without limits."
        />

        {/* Region cards grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {regions.map((r, i) => (
            <RegionCard
              key={r.id}
              region={r}
              index={i}
              isActive={activeRegion === r.id}
              onClick={() => setActiveRegion(r.id)}
            />
          ))}
        </div>

        {/* Region detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-xl border bg-card/60 backdrop-blur-sm relative overflow-hidden"
            style={{ borderColor: `${region.color}40` }}
          >
            {/* Color accent glows */}
            <div
              className="absolute top-0 right-0 w-48 h-48 blur-3xl opacity-15 rounded-full pointer-events-none"
              style={{ background: region.color }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 blur-2xl opacity-10 rounded-full pointer-events-none"
              style={{ background: region.color }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{regionIcons[region.id]}</span>
                <p
                  className="text-xs font-display font-semibold tracking-[0.2em] uppercase"
                  style={{ color: region.color }}
                >
                  {region.atmosphere}
                </p>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-4">
                {region.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {region.description}
              </p>
            </div>

            <div className="relative">
              <p className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Key Locations
              </p>
              <ul className="space-y-3">
                {region.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-sm text-foreground/80"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: region.color,
                        boxShadow: `0 0 8px ${region.color}`,
                      }}
                    />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
        {regionInlineBlocks.length > 0 && (
          <div className="mt-4 space-y-3">
            {regionInlineBlocks.map((block) => (
              <RegionInlineBlock key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
