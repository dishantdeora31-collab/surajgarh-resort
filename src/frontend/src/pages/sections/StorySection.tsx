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
import { Download, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type CharKey = "kael" | "seraphiel" | "nyra" | "azrath" | "eternal";

interface CharTheme {
  glow: string;
  border: string;
  text: string;
  bg: string;
  tabActive: string;
}

const themes: Record<CharKey, CharTheme> = {
  kael: {
    glow: "oklch(0.65 0.22 60)",
    border: "oklch(0.65 0.22 60 / 0.5)",
    text: "oklch(0.75 0.22 55)",
    bg: "linear-gradient(135deg, oklch(0.16 0.04 60 / 0.8), oklch(0.20 0.06 55 / 0.6))",
    tabActive: "oklch(0.65 0.22 60 / 0.12)",
  },
  seraphiel: {
    glow: "oklch(0.70 0.08 220)",
    border: "oklch(0.70 0.08 220 / 0.5)",
    text: "oklch(0.80 0.06 220)",
    bg: "linear-gradient(135deg, oklch(0.16 0.04 220 / 0.8), oklch(0.20 0.05 200 / 0.6))",
    tabActive: "oklch(0.70 0.08 220 / 0.12)",
  },
  nyra: {
    glow: "oklch(0.60 0.20 15)",
    border: "oklch(0.60 0.20 15 / 0.5)",
    text: "oklch(0.70 0.20 20)",
    bg: "linear-gradient(135deg, oklch(0.16 0.06 15 / 0.8), oklch(0.20 0.08 20 / 0.6))",
    tabActive: "oklch(0.60 0.20 15 / 0.12)",
  },
  azrath: {
    glow: "oklch(0.50 0.18 295)",
    border: "oklch(0.50 0.18 295 / 0.5)",
    text: "oklch(0.62 0.18 290)",
    bg: "linear-gradient(135deg, oklch(0.15 0.05 295 / 0.8), oklch(0.18 0.07 280 / 0.6))",
    tabActive: "oklch(0.50 0.18 295 / 0.12)",
  },
  eternal: {
    glow: "oklch(0.88 0.04 200)",
    border: "oklch(0.88 0.04 200 / 0.45)",
    text: "oklch(0.92 0.03 200)",
    bg: "linear-gradient(135deg, oklch(0.18 0.03 220 / 0.8), oklch(0.22 0.04 200 / 0.6))",
    tabActive: "oklch(0.88 0.04 200 / 0.08)",
  },
};

interface TagPillProps {
  label: string;
  color: string;
}

function TagPill({ label, color }: TagPillProps) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-display font-semibold tracking-wide"
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
      }}
    >
      {label}
    </span>
  );
}

interface TagGroupProps {
  label: string;
  tags: string[];
  color: string;
  arrow?: boolean;
}

function TagGroup({ label, tags, color, arrow = false }: TagGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={tag} className="flex items-center gap-1.5">
            <TagPill label={tag} color={color} />
            {arrow && i < tags.length - 1 && (
              <span className="text-muted-foreground/40 text-xs">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

const tabs: { key: CharKey; label: string; icon: string }[] = [
  { key: "kael", label: "Kael", icon: "⚡" },
  { key: "seraphiel", label: "Seraphiel", icon: "🪽" },
  { key: "nyra", label: "Nyra", icon: "🔥" },
  { key: "azrath", label: "Azrath", icon: "💀" },
  { key: "eternal", label: "Eternal Presence", icon: "✨" },
];

interface CharPanel {
  title: string;
  subtitle: string;
  description: string;
  groups: { label: string; tags: string[]; arrow?: boolean }[];
  goal?: string;
}

const panels: Record<CharKey, CharPanel> = {
  kael: {
    title: "Kael — The Ascendant",
    subtitle: "The Main Protagonist",
    description:
      "A lone survivor born during the original VAMP-X experiment. Kael carries a mysterious celestial mark connected to the Heart of Ascension, allowing him to absorb divine powers from defeated enemies.",
    groups: [
      {
        label: "Journey",
        tags: [
          "Weak Survivor",
          "Powerful Warrior",
          "Celestial Being",
          "Humanity's Final Hope",
        ],
        arrow: true,
      },
      {
        label: "Personality",
        tags: ["Calm", "Determined", "Emotionally Broken but Compassionate"],
      },
    ],
  },
  seraphiel: {
    title: "Seraphiel — The Fallen Angel",
    subtitle: "The Mysterious Guide",
    description:
      "A legendary angel cast out of Heaven during the celestial war. Seraphiel becomes Kael's mysterious guide and slowly reveals the truth about Heaven, monsters, and God.",
    groups: [
      {
        label: "Appearance",
        tags: ["Broken Wings", "Silver Armor", "Glowing White Eyes"],
      },
      {
        label: "Personality",
        tags: ["Wise", "Cold", "Regretful", "Loyal to Kael"],
      },
    ],
  },
  nyra: {
    title: "Nyra — The Survivor Queen",
    subtitle: "Leader of the Resistance",
    description:
      "Leader of the last human resistance. Nyra believes humanity should survive without divine powers and often questions Kael's transformation.",
    groups: [
      {
        label: "Role",
        tags: [
          "Emotional Support",
          "Tactical Leader",
          "Moral Balance of the Story",
        ],
      },
    ],
  },
  azrath: {
    title: "Azrath — The First Fallen",
    subtitle: "The Main Antagonist",
    description:
      "Once Heaven's strongest guardian, Azrath rebelled after believing humanity would destroy existence. Now he commands fallen angels, titans, corrupted gods, and cosmic monsters.",
    groups: [
      {
        label: "Commands",
        tags: ["Fallen Angels", "Titans", "Corrupted Gods", "Cosmic Monsters"],
      },
    ],
    goal: "Destroy free will and create eternal order.",
  },
  eternal: {
    title: "The Eternal Presence",
    subtitle: "The Silent God",
    description:
      "The mysterious cosmic entity waiting at the end of Heaven. Not evil. Not good. A timeless being observing humanity's final choice. Appears only in the final act.",
    groups: [],
  },
};

const introText =
  "In 2098, the corporation VAMP-X accidentally opens fractures in reality after activating the mysterious Heart of Ascension hidden beneath Earth. Monsters, fallen angels, and cosmic horrors invade the world as civilization collapses. The player becomes Kael — guided by the fallen angel Seraphiel and aided by resistance leader Nyra. Standing against him is Azrath, determined to erase human freedom forever. Kael's journey leads to Heaven, where he faces The Eternal Presence and must decide the fate of humanity: eternal control or freedom through sacrifice.";

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

function InlineContentBlock({ block }: { block: CustomContentBlock }) {
  return (
    <div
      className="mt-4 rounded-lg overflow-hidden p-4 flex flex-col gap-3"
      style={{
        background: "oklch(0.14 0.02 270 / 0.6)",
        border: "1px solid oklch(0.28 0.06 60 / 0.3)",
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
          className="w-full h-auto rounded-md max-h-64 object-cover"
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

export default function StorySection() {
  const { siteConfig } = useSiteConfigContext();
  const [active, setActive] = useState<CharKey>("kael");

  // Reset active tab if the current character no longer exists in siteConfig
  useEffect(() => {
    if (siteConfig?.characters?.length) {
      const ids = siteConfig.characters.map((c) => c.id);
      if (!ids.includes(active)) {
        setActive((siteConfig.characters[0].id ?? "kael") as CharKey);
      }
    }
  }, [siteConfig?.characters, active]);
  const theme = themes[active] ?? themes.kael;

  // Merge siteConfig characters into the panels map when available
  const activePanelFromConfig = siteConfig?.characters?.find(
    (c) => c.id === active,
  );
  const panel: CharPanel = activePanelFromConfig
    ? {
        title: `${activePanelFromConfig.name} — ${activePanelFromConfig.title}`,
        subtitle: activePanelFromConfig.title,
        description: activePanelFromConfig.description,
        groups: [
          ...(activePanelFromConfig.journey.length > 0
            ? [
                {
                  label: "Journey",
                  tags: activePanelFromConfig.journey,
                  arrow: true,
                },
              ]
            : []),
          ...(activePanelFromConfig.personality.length > 0
            ? [
                {
                  label: "Personality",
                  tags: activePanelFromConfig.personality,
                },
              ]
            : []),
          ...(activePanelFromConfig.appearance.length > 0
            ? [{ label: "Appearance", tags: activePanelFromConfig.appearance }]
            : []),
        ],
      }
    : panels[active];

  const narrative = siteConfig?.narrative || introText;

  // Build tabs from siteConfig characters if available, else fallback
  const dynamicTabs: { key: CharKey; label: string; icon: string }[] =
    siteConfig?.characters?.length
      ? siteConfig.characters.map((c, i) => ({
          key: c.id as CharKey,
          label: c.name,
          icon: tabs[i]?.icon ?? "✦",
        }))
      : tabs;

  return (
    <section
      id="story"
      data-ocid="story.section"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0 0) 0%, oklch(0.14 0.01 270) 50%, oklch(0.12 0 0) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] blur-[180px] opacity-[0.07] pointer-events-none transition-smooth"
        style={{ background: theme.glow }}
      />

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="The Cosmic Saga"
          title="ASCENT — The Story"
          subtitle=""
        />

        {/* Narrative intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-6 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto text-center"
        >
          {narrative}
        </motion.p>

        {/* Character tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-wrap gap-2 justify-center"
          role="tablist"
          aria-label="Characters"
        >
          {dynamicTabs.map((tab) => {
            const t = themes[tab.key as CharKey] ?? themes.kael;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-ocid={`story.char_tab.${tab.key}`}
                onClick={() => setActive(tab.key as CharKey)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-smooth"
                style={{
                  background: isActive ? t.tabActive : "oklch(0.16 0 0 / 0.5)",
                  border: `1px solid ${isActive ? t.border : "oklch(0.24 0 0)"}`,
                  color: isActive ? t.text : "oklch(0.6 0 0)",
                  boxShadow: isActive ? `0 0 16px ${t.glow}33` : "none",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Character detail panel */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl border p-8 sm:p-10 overflow-hidden"
              style={{
                borderColor: theme.border,
                background: theme.bg,
                boxShadow: `0 0 60px ${theme.glow}22`,
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-60 h-60 blur-3xl opacity-20 rounded-full pointer-events-none"
                style={{ background: theme.glow }}
              />
              <div
                className="absolute bottom-0 left-0 w-40 h-40 blur-2xl opacity-10 rounded-full pointer-events-none"
                style={{ background: theme.glow }}
              />

              <div className="relative">
                {/* Header */}
                <div className="mb-6">
                  <p
                    className="text-xs font-display font-semibold tracking-[0.25em] uppercase mb-2"
                    style={{ color: theme.text, opacity: 0.7 }}
                  >
                    {panel.subtitle}
                  </p>
                  <h3
                    className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl"
                    style={{
                      color: theme.text,
                      textShadow: `0 0 24px ${theme.glow}88`,
                    }}
                  >
                    {panel.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-foreground/80 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl">
                  {panel.description}
                </p>

                {/* Tag groups */}
                {panel.groups.length > 0 && (
                  <div className="flex flex-col gap-5">
                    {panel.groups.map((group) => (
                      <TagGroup
                        key={group.label}
                        label={group.label}
                        tags={group.tags}
                        color={theme.text}
                        arrow={group.arrow}
                      />
                    ))}
                  </div>
                )}

                {/* Goal block (Azrath) */}
                {panel.goal && (
                  <div
                    className="mt-6 px-5 py-3 rounded-lg border"
                    style={{
                      borderColor: `${theme.border}`,
                      background: `${theme.glow}11`,
                    }}
                  >
                    <p className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                      Goal
                    </p>
                    <p
                      className="text-sm font-display font-bold"
                      style={{ color: theme.text }}
                    >
                      {panel.goal}
                    </p>
                  </div>
                )}

                {/* Inline custom content blocks for this character */}
                {(() => {
                  const inlineBlocks = (siteConfig?.customContent ?? [])
                    .filter((b) => b.targetSection === active)
                    .sort((a, b2) => Number(a.order) - Number(b2.order));
                  return inlineBlocks.length > 0 ? (
                    <div className="mt-6 space-y-3">
                      {inlineBlocks.map((block) => (
                        <InlineContentBlock key={block.id} block={block} />
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cinematic tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-20 text-center"
        >
          <div
            className="relative inline-block px-8 py-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.04 60 / 0.6), oklch(0.18 0.06 55 / 0.4))",
              border: "1px solid oklch(0.65 0.22 60 / 0.35)",
              boxShadow: "0 0 60px oklch(0.65 0.22 60 / 0.2)",
            }}
          >
            <motion.p
              className="font-display font-bold text-3xl sm:text-5xl tracking-[0.12em] uppercase"
              animate={{
                textShadow: [
                  "0 0 20px oklch(0.65 0.22 60 / 0.4), 0 0 40px oklch(0.65 0.22 60 / 0.2)",
                  "0 0 40px oklch(0.65 0.22 60 / 0.8), 0 0 80px oklch(0.65 0.22 60 / 0.4)",
                  "0 0 20px oklch(0.65 0.22 60 / 0.4), 0 0 40px oklch(0.65 0.22 60 / 0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ color: "oklch(0.75 0.22 55)" }}
            >
              &ldquo;{siteConfig?.tagline || "Fight. Evolve. Ascend."}&rdquo;
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
