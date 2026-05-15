import SectionHeader from "@/components/SectionHeader";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { evolutionStages } from "@/data/gameData";
import type { EvolutionStage } from "@/types/game";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const stageStats: Record<
  number,
  { power: number; agility: number; divinity: number; resilience: number }
> = {
  1: { power: 5, agility: 10, divinity: 0, resilience: 8 },
  2: { power: 30, agility: 45, divinity: 15, resilience: 35 },
  3: { power: 65, agility: 70, divinity: 55, resilience: 60 },
  4: { power: 85, agility: 88, divinity: 82, resilience: 80 },
  5: { power: 100, agility: 100, divinity: 100, resilience: 100 },
};

function StatBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-display text-muted-foreground tracking-wide">
          {label}
        </span>
        <span className="text-xs font-display font-semibold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: value > 50 ? `0 0 6px ${color}88` : "none",
          }}
        />
      </div>
    </div>
  );
}

function StageNode({
  stage,
  index,
  isActive,
  onClick,
}: {
  stage: EvolutionStage;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`evolution.stage.${index + 1}`}
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-0"
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-smooth"
        style={{
          borderColor: isActive ? stage.glowColor : "oklch(0.24 0 0)",
          background: isActive ? `${stage.glowColor}22` : "oklch(0.16 0 0)",
          boxShadow: isActive
            ? `0 0 30px ${stage.glowColor}55, 0 0 60px ${stage.glowColor}22`
            : "none",
          animation: isActive ? "glow-pulse 3s ease-in-out infinite" : "none",
        }}
      >
        <span
          className="text-lg sm:text-xl font-display font-bold transition-smooth"
          style={{ color: isActive ? stage.glowColor : "oklch(0.6 0 0)" }}
        >
          {stage.id}
        </span>
      </motion.div>
      <span
        className="text-[10px] sm:text-xs font-display font-semibold tracking-wide text-center truncate max-w-[72px] transition-smooth"
        style={{ color: isActive ? stage.glowColor : "oklch(0.6 0 0)" }}
      >
        {stage.name}
      </span>
    </button>
  );
}

export default function EvolutionSection() {
  const { siteConfig } = useSiteConfigContext();
  const [activeStage, setActiveStage] = useState(1);

  // Merge backend text fields with local visual fields (glowColor, aura, label)
  const mergedStages: EvolutionStage[] = evolutionStages.map((local, i) => {
    const remote = siteConfig?.evolutionStages?.[i];
    if (!remote) return local;
    return {
      ...local,
      name: remote.name || local.name,
      description: remote.description || local.description,
      traits: remote.traits.length > 0 ? remote.traits : local.traits,
    };
  });

  const stage =
    mergedStages.find((s) => s.id === activeStage) ?? mergedStages[0];
  const stats = stageStats[activeStage];

  return (
    <section
      id="evolution"
      data-ocid="evolution.section"
      className="relative py-24 sm:py-32 bg-card/20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background pointer-events-none" />

      {/* Dynamic ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] blur-[120px] opacity-10 pointer-events-none transition-smooth"
        style={{ background: stage.glowColor }}
      />

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Player Evolution"
          title="Evolution Showcase"
          subtitle="From fearful survivor to cosmic deity. Every victory reshapes who — and what — you are."
        />

        {/* Evolution image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 rounded-xl overflow-hidden border border-border/40 relative"
        >
          <img
            src="/assets/generated/evolution-stages.dim_1400x700.jpg"
            alt="Player evolution from mortal to cosmic entity"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
          {/* Stage labels overlaid */}
        </motion.div>

        {/* Stage selector */}
        <div className="mt-10 flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {mergedStages.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <StageNode
                stage={s}
                index={i}
                isActive={activeStage === s.id}
                onClick={() => setActiveStage(s.id)}
              />
              {i < mergedStages.length - 1 && (
                <motion.div
                  className="flex-1 h-px transition-smooth"
                  style={{
                    background:
                      activeStage > s.id
                        ? `linear-gradient(90deg, ${s.glowColor}, ${mergedStages[i + 1].glowColor})`
                        : "oklch(0.24 0 0)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-xl border bg-card/60 backdrop-blur-sm"
            style={{ borderColor: `${stage.glowColor}40` }}
          >
            <div>
              <p
                className="text-xs font-display font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: stage.glowColor }}
              >
                Stage {stage.id} of 5
              </p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
                {stage.name}
              </h3>
              <p className="text-sm font-display text-muted-foreground mb-4">
                {stage.label}
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {stage.description}
              </p>
              <p className="mt-4 text-xs font-display tracking-wide text-muted-foreground/60 italic">
                Aura: {stage.aura}
              </p>
            </div>

            <div>
              <p className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Unlocked Abilities
              </p>
              <ul className="space-y-3">
                {stage.traits.map((trait, i) => (
                  <motion.li
                    key={trait}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: stage.glowColor,
                        boxShadow: `0 0 8px ${stage.glowColor}`,
                      }}
                    />
                    <span className="text-foreground/85">{trait}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Power Profile
              </p>
              <div className="flex flex-col gap-4">
                <StatBar
                  label="Power"
                  value={stats.power}
                  color={stage.glowColor}
                />
                <StatBar
                  label="Agility"
                  value={stats.agility}
                  color={stage.glowColor}
                />
                <StatBar
                  label="Divinity"
                  value={stats.divinity}
                  color={stage.glowColor}
                />
                <StatBar
                  label="Resilience"
                  value={stats.resilience}
                  color={stage.glowColor}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
