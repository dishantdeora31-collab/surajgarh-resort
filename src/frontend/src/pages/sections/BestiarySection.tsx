import SectionHeader from "@/components/SectionHeader";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { enemies } from "@/data/gameData";
import type { EnemyType } from "@/types/game";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const tierConfig: Record<
  EnemyType["tier"],
  { label: string; badgeClass: string }
> = {
  common: {
    label: "Soldier",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  elite: {
    label: "Elite",
    badgeClass: "bg-secondary/20 text-secondary border-secondary/40",
  },
  boss: {
    label: "Boss",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/40",
  },
  cosmic: {
    label: "Cosmic",
    badgeClass: "bg-primary/20 text-primary border-primary/40",
  },
};

const enemyCombatRoles: Record<string, string> = {
  "corrupted-human": "Swarm Infantry",
  "shadow-titan": "Area Control",
  "fallen-angel": "Aerial Assault",
  "shadow-creature": "Stealth Hunter",
  "biomechanical-demon": "Siege Unit",
  "cosmic-horror": "Reality Breaker",
  "ancient-god": "Domain Ruler",
  "celestial-guardian": "Gate Sentinel",
};

const enemySignatureAbilities: Record<string, string> = {
  "corrupted-human": "Infectious Swarm",
  "shadow-titan": "Void Tremor",
  "fallen-angel": "Sacred Inferno",
  "shadow-creature": "Soul Drain",
  "biomechanical-demon": "Adaptive Resurrection",
  "cosmic-horror": "Sanity Fracture",
  "ancient-god": "Divine Dominion",
  "celestial-guardian": "Heaven's Judgment",
};

const dangerBarKeys = [
  "b0",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
];

function EnemyCard({
  enemy,
  index,
  isActive,
  onClick,
}: {
  enemy: EnemyType;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const tier = tierConfig[enemy.tier];
  return (
    <motion.button
      type="button"
      data-ocid={`bestiary.enemy.${index + 1}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative flex flex-col gap-3 p-4 rounded-xl border text-left transition-smooth cursor-pointer overflow-hidden"
      style={{
        borderColor: isActive ? enemy.color : "oklch(0.24 0 0)",
        background: isActive ? "oklch(0.16 0 0)" : "oklch(0.15 0 0 / 0.6)",
        boxShadow: isActive
          ? `0 0 20px ${enemy.color}33, 0 0 40px ${enemy.color}15`
          : "none",
      }}
    >
      {/* Top color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl transition-smooth"
        style={{ background: enemy.color, opacity: isActive ? 1 : 0.4 }}
      />
      {isActive && (
        <div
          className="absolute top-0 right-0 w-20 h-20 blur-2xl opacity-20 rounded-full pointer-events-none"
          style={{ background: enemy.color }}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <h3
          className="font-display font-bold text-sm transition-smooth"
          style={{ color: isActive ? enemy.color : "oklch(0.94 0 0)" }}
        >
          {enemy.name}
        </h3>
        <span
          className={`text-[10px] font-display font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${tier.badgeClass}`}
        >
          {tier.label}
        </span>
      </div>

      {/* Danger level bars */}
      <div className="flex items-center gap-0.5">
        {dangerBarKeys.map((k, i) => (
          <div
            key={k}
            className="flex-1 h-1.5 rounded-full transition-smooth"
            style={{
              background:
                i < enemy.dangerLevel ? enemy.color : "oklch(0.22 0 0)",
              boxShadow:
                i < enemy.dangerLevel && isActive
                  ? `0 0 4px ${enemy.color}`
                  : "none",
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-display text-muted-foreground tracking-wide">
          {enemyCombatRoles[enemy.id]}
        </span>
        <span
          className="text-[10px] font-display font-semibold"
          style={{ color: enemy.color }}
        >
          {enemy.dangerLevel}/10
        </span>
      </div>
    </motion.button>
  );
}

export default function BestiarySection() {
  const { siteConfig } = useSiteConfigContext();
  // Merge backend enemies with frontend visual data
  const enemyList: EnemyType[] = siteConfig?.enemies?.length
    ? siteConfig.enemies.map((e) => {
        const base = enemies.find((be) => be.id === e.id);
        return {
          id: e.id,
          name: e.name,
          description: e.description,
          abilities: e.abilities,
          dangerLevel: Number(e.dangerLevel) || base?.dangerLevel || 1,
          tier: base?.tier ?? "common",
          color: base?.color ?? "oklch(0.65 0.22 60)",
        };
      })
    : enemies;
  const [active, setActive] = useState("corrupted-human");
  const enemy = enemyList.find((e) => e.id === active) ?? enemyList[0];
  const tier = tierConfig[enemy.tier];

  return (
    <section
      id="bestiary"
      data-ocid="bestiary.section"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background pointer-events-none" />

      {/* Bestiary image as ambient bg */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <img
          src="/assets/generated/bestiary-collage.dim_1600x800.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
      </div>

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Enemy Bestiary"
          title="Enemy Bestiary"
          subtitle="Every creature born of a broken universe. Threat level determines classification — from soldiers to cosmic horrors."
        />

        {/* Tier legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          {(["common", "elite", "boss", "cosmic"] as EnemyType["tier"][]).map(
            (t) => (
              <div
                key={t}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-display font-semibold tracking-widest uppercase ${tierConfig[t].badgeClass}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {tierConfig[t].label}
              </div>
            ),
          )}
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enemy grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enemyList.map((e, i) => (
              <EnemyCard
                key={e.id}
                enemy={e}
                index={i}
                isActive={active === e.id}
                onClick={() => setActive(e.id)}
              />
            ))}
          </div>

          {/* Enemy detail */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={enemy.id}
                initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0)" }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-xl border bg-card/80 backdrop-blur-sm relative overflow-hidden"
                style={{ borderColor: `${enemy.color}40` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 blur-3xl opacity-15 rounded-full pointer-events-none"
                  style={{ background: enemy.color }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {enemy.name}
                    </h3>
                    <span
                      className={`text-[10px] font-display font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${tier.badgeClass}`}
                    >
                      {tier.label}
                    </span>
                  </div>

                  {/* Role + signature */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="text-[10px] font-display font-semibold tracking-widest uppercase px-2 py-1 rounded border"
                      style={{
                        borderColor: `${enemy.color}44`,
                        color: enemy.color,
                        background: `${enemy.color}11`,
                      }}
                    >
                      {enemyCombatRoles[enemy.id]}
                    </span>
                    <span className="text-[10px] font-display font-semibold tracking-widest uppercase px-2 py-1 rounded border border-border text-muted-foreground">
                      {enemySignatureAbilities[enemy.id]}
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                    {enemy.description}
                  </p>

                  <div>
                    <p className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Threat Abilities
                    </p>
                    <ul className="space-y-2">
                      {enemy.abilities.map((ability, i) => (
                        <motion.li
                          key={ability}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{
                              background: enemy.color,
                              boxShadow: `0 0 6px ${enemy.color}`,
                            }}
                          />
                          {ability}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-display tracking-wide">
                        Danger Level
                      </span>
                      <span
                        className="text-sm font-display font-bold"
                        style={{ color: enemy.color }}
                      >
                        {enemy.dangerLevel}/10
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${enemy.dangerLevel * 10}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${enemy.color}88, ${enemy.color})`,
                          boxShadow: `0 0 8px ${enemy.color}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
