import SectionHeader from "@/components/SectionHeader";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { combatSections } from "@/data/gameData";
import type { AbilityCard } from "@/types/game";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const categoryColors: Record<AbilityCard["category"], string> = {
  melee: "oklch(0.65 0.22 25)",
  ranged: "oklch(0.55 0.18 200)",
  divine: "oklch(0.70 0.22 60)",
  cosmic: "oklch(0.55 0.20 270)",
};

const decorLineKeys = ["dl0", "dl1", "dl2", "dl3", "dl4", "dl5", "dl6", "dl7"];

const tabLabels: Record<string, string> = {
  weapons: "\u2694 Arsenal",
  combat: "🥊 Combat",
  powers: "\u2726 Divine Powers",
};

function AbilityCardItem({
  card,
  index,
}: { card: AbilityCard; index: number }) {
  const catColor = categoryColors[card.category];
  return (
    <motion.div
      data-ocid={`combat.ability.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative flex flex-col gap-3 p-5 rounded-xl border border-border bg-card/70 backdrop-blur-sm hover:border-primary/40 transition-smooth overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full pointer-events-none"
        style={{ background: card.color }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, ${card.color}00, ${card.color}88, ${card.color}00)`,
        }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: catColor, opacity: 0.6 }}
      />

      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: `${card.color}20`,
            border: `1px solid ${card.color}40`,
          }}
        >
          {card.icon}
        </div>
        <div className="min-w-0">
          <span
            className="text-[10px] font-display font-semibold tracking-[0.15em] uppercase block mb-0.5"
            style={{ color: catColor }}
          >
            {card.category}
          </span>
          <h4 className="font-display font-bold text-sm text-foreground">
            {card.name}
          </h4>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {card.description}
      </p>
    </motion.div>
  );
}

export default function CombatSection() {
  const { siteConfig } = useSiteConfigContext();
  // Backend combatSections use string items; map them to AbilityCard for display
  const sections = siteConfig?.combatSections?.length
    ? siteConfig.combatSections.map((s) => {
        const base = combatSections.find((cs) => cs.id === s.id);
        // Use base items if available, so the rich card data is preserved
        return base
          ? { ...base, title: s.title, subtitle: s.description }
          : (base ?? combatSections[0]);
      })
    : combatSections;
  const [activeSection, setActiveSection] = useState("weapons");
  const section = sections.find((s) => s.id === activeSection) ?? sections[0];

  return (
    <section
      id="combat"
      data-ocid="combat.section"
      className="relative py-24 sm:py-32 bg-card/20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />

      {/* Decorative energy lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] overflow-hidden">
        {decorLineKeys.map((id, i) => (
          <div
            key={id}
            className="absolute h-px w-full gradient-divine"
            style={{ top: `${8 + i * 12}%`, transform: "rotate(-2deg)" }}
          />
        ))}
      </div>

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Combat System"
          title="Combat &amp; Abilities"
          subtitle="Fluid, brutal, cinematic — every fight is a statement. Every enemy demands a different approach."
        />

        {/* Section tabs */}
        <div
          className="mt-12 flex gap-2 sm:gap-3 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Combat categories"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeSection === s.id}
              data-ocid={`combat.tab.${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className={`px-6 py-3 rounded-lg font-display font-bold text-sm tracking-wide whitespace-nowrap transition-smooth
                ${
                  activeSection === s.id
                    ? "gradient-divine text-background shadow-glow-divine"
                    : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-card/50"
                }`}
            >
              {tabLabels[s.id] ?? s.title}
            </button>
          ))}
        </div>

        {/* Section subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={section.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-muted-foreground text-sm"
          >
            {section.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Ability cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {section.items.map((card, i) => (
              <AbilityCardItem key={card.id} card={card} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Movement system callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 p-8 rounded-xl border-divine bg-card/40 backdrop-blur-sm relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 60 / 0.1), transparent, oklch(0.50 0.18 270 / 0.1))",
            }}
          />
          <div className="relative">
            <p className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-primary mb-2">
              Movement System
            </p>
            <h3
              className="font-display font-bold text-xl sm:text-2xl text-foreground mb-4"
              style={{ textShadow: "0 0 20px oklch(0.65 0.22 60 / 0.5)" }}
            >
              Precision Movement System
            </h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-2xl">
              Every movement mechanic crafted for precision and fluidity — then
              elevated with divine physics and celestial-grade response.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Sprint",
                "Slide",
                "Dodge",
                "Parkour",
                "Climb",
                "Swim",
                "Aerial",
                "Ledge Grab",
                "Teleport",
                "Flight",
              ].map((move) => (
                <span
                  key={move}
                  className="px-3 py-1 text-xs font-display font-semibold tracking-wide rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-smooth cursor-default"
                >
                  {move}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
