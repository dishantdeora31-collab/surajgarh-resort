import type {
  CombatSection,
  EnemyType,
  EvolutionStage,
  Region,
  StoryAct,
} from "@/types/game";

export const storyActs: StoryAct[] = [
  {
    number: 1,
    title: "The Collapse",
    subtitle: "ACT 1",
    description:
      "Humanity falls. Reality fractures. Cities crumble to ash as monstrous entities pour through dimensional rifts. You are alone — a survivor with no answers, only the will to endure.",
    gradient: "gradient-act-1",
    icon: "💀",
    phase: "Fear → Survival",
  },
  {
    number: 2,
    title: "The Revelation",
    subtitle: "ACT 2",
    description:
      "Ancient truths surface from the ruins. Fallen angels walk among the wreckage. A divine war has been raging for millennia — and you are caught in its crossfire. Supernatural power awakens within.",
    gradient: "gradient-act-2",
    icon: "⚡",
    phase: "Power → Corruption",
  },
  {
    number: 3,
    title: "The Ascension",
    subtitle: "ACT 3",
    description:
      "You transcend the limits of humanity. Celestial realms unlock. Heaven becomes reachable as reality nears total collapse. Every choice you've made reshapes existence itself.",
    gradient: "gradient-act-3",
    icon: "✦",
    phase: "Enlightenment → Transcendence",
  },
  {
    number: 4,
    title: "The Throne Beyond Heaven",
    subtitle: "FINAL ACT",
    description:
      "The golden kingdom awaits. Celestial armies divide. God is finally revealed. The eternal truth about existence, suffering, free will — and what it means to be human — is laid bare before you.",
    gradient: "gradient-act-4",
    icon: "👁",
    phase: "The Final Truth",
  },
];

export const worldRegions: Region[] = [
  {
    id: "fallen-earth",
    name: "Fallen Earth",
    description:
      "Shattered futuristic cities, abandoned highways stretching into toxic haze. Military ruins guard secrets of the collapse. Underground bunkers hold the last of humanity.",
    atmosphere: "Despair & Survival",
    features: [
      "Destroyed megacities",
      "Underground bunkers",
      "Infected wastelands",
      "Ruined military zones",
    ],
    color: "oklch(0.55 0.22 25)",
    accentColor: "#c0392b",
  },
  {
    id: "cursed-wilderness",
    name: "Cursed Wilderness",
    description:
      "Haunted forests where the trees breathe with dark intent. The bones of giants litter the corrupted earth. Ancient kingdoms swallowed whole by the dark.",
    atmosphere: "Ancient Dread",
    features: [
      "Haunted forests",
      "Giant dead creatures",
      "Corrupted rivers",
      "Abandoned kingdoms",
    ],
    color: "oklch(0.40 0.18 140)",
    accentColor: "#27ae60",
  },
  {
    id: "ashen-realms",
    name: "Ashen Realms",
    description:
      "Volcanic mountains tear through burning skies. Oceans of lava flow past the tombs of titans. Ancient temples smolder with divine fire that never dies.",
    atmosphere: "Catastrophic Power",
    features: [
      "Volcanic mountains",
      "Lava oceans",
      "Titan graveyards",
      "Burning sky temples",
    ],
    color: "oklch(0.62 0.25 45)",
    accentColor: "#e67e22",
  },
  {
    id: "celestial-frontier",
    name: "Celestial Frontier",
    description:
      "Floating islands drift among sky temples of impossible architecture. Heavenly gateways crackle with divine energy. Shattered moons hang in eternal twilight.",
    atmosphere: "Divine Wonder",
    features: [
      "Floating islands",
      "Sky temples",
      "Heavenly gateways",
      "Shattered moons",
    ],
    color: "oklch(0.65 0.20 200)",
    accentColor: "#2980b9",
  },
  {
    id: "heaven",
    name: "Heaven",
    description:
      "A gigantic golden kingdom above the universe itself. Celestial oceans of infinite cloud. Divine structures of impossible scale. The mysterious throne awaits at the center of all creation.",
    atmosphere: "Divine Revelation",
    features: [
      "Golden kingdom",
      "Celestial oceans",
      "Divine structures",
      "The Throne of God",
    ],
    color: "oklch(0.75 0.22 60)",
    accentColor: "#f1c40f",
  },
];

export const evolutionStages: EvolutionStage[] = [
  {
    id: 1,
    name: "Mortal",
    label: "The Beginning",
    description:
      "A weak human survivor. Basic clothing, limited stamina, consumed by fear. Every creature is a death sentence.",
    traits: ["Basic stamina", "No powers", "Human speed", "Fear response"],
    aura: "none",
    glowColor: "oklch(0.60 0 0)",
  },
  {
    id: 2,
    name: "Awakened",
    label: "Supernatural Born",
    description:
      "Enhanced beyond human limits. Supernatural powers emerge. Glowing energy marks appear on skin. Armor begins its divine evolution.",
    traits: [
      "Enhanced strength",
      "Lightning dash",
      "Healing factor",
      "Danger sense",
    ],
    aura: "faint gold",
    glowColor: "oklch(0.65 0.15 60)",
  },
  {
    id: 3,
    name: "Ascended",
    label: "Beyond Humanity",
    description:
      "Reality bends to your will. Celestial energy erupts from within. Enemies flee at your approach. The gods take notice.",
    traits: [
      "Gravity manipulation",
      "Time slowing",
      "Celestial blasts",
      "Divine armor",
    ],
    aura: "blazing gold",
    glowColor: "oklch(0.72 0.22 60)",
  },
  {
    id: 4,
    name: "Empyrean",
    label: "Celestial Form",
    description:
      "You are no longer bound to flesh. Energy wings unfurl. Dimensional attacks tear through existence. You stand equal to fallen gods.",
    traits: [
      "Flight",
      "Dimensional rifts",
      "Divine transformation",
      "Reality anchoring",
    ],
    aura: "divine radiance",
    glowColor: "oklch(0.80 0.18 60)",
  },
  {
    id: 5,
    name: "Cosmic Entity",
    label: "The Final Form",
    description:
      "Existence itself acknowledges you. Reality-altering abilities reshape the cosmos. You are the final question — and the answer.",
    traits: [
      "Reality alteration",
      "Cosmic omnisense",
      "Universe-scale power",
      "Infinite form",
    ],
    aura: "cosmic transcendence",
    glowColor: "oklch(0.90 0.15 280)",
  },
];

export const enemies: EnemyType[] = [
  {
    id: "corrupted-human",
    name: "Corrupted Human",
    tier: "common",
    description:
      "Once ordinary people, now twisted by dimensional energy. Their eyes glow crimson. They hunt in packs, driven by an alien intelligence.",
    dangerLevel: 2,
    abilities: ["Pack tactics", "Frenzy mode", "Infectious bite"],
    color: "oklch(0.55 0.22 25)",
  },
  {
    id: "shadow-titan",
    name: "Shadow Titan",
    tier: "elite",
    description:
      "Colossal entities of living darkness that blot out the sky. Ancient and malevolent, they reshape the landscape with every step.",
    dangerLevel: 7,
    abilities: ["Tremor stomp", "Darkness veil", "Titan roar"],
    color: "oklch(0.35 0.05 270)",
  },
  {
    id: "fallen-angel",
    name: "Fallen Angel",
    tier: "elite",
    description:
      "Divine beings cast from heaven, warped by corruption. They wield weapons of sacred fire and speak in shattered holy tongues.",
    dangerLevel: 8,
    abilities: ["Sacred fire", "Divine wings", "Heavenly wrath"],
    color: "oklch(0.50 0.20 290)",
  },
  {
    id: "shadow-creature",
    name: "Shadow Creature",
    tier: "common",
    description:
      "Born from dimensional tears, these entities exist between light and void. They phase through walls and feed on life energy.",
    dangerLevel: 4,
    abilities: ["Phase shift", "Life drain", "Shadow strike"],
    color: "oklch(0.30 0.08 260)",
  },
  {
    id: "biomechanical-demon",
    name: "Biomechanical Demon",
    tier: "boss",
    description:
      "Failed divine creations — biological horrors fused with impossible machines. They are the first draft of a species that was never meant to exist.",
    dangerLevel: 9,
    abilities: ["Plasma cannon", "Regeneration", "Adaptive armor"],
    color: "oklch(0.45 0.20 150)",
  },
  {
    id: "cosmic-horror",
    name: "Cosmic Horror",
    tier: "cosmic",
    description:
      "Entities from beyond the edge of reality itself. Looking at them fractures the mind. Their forms are incomprehensible — a glimpse of what waits when existence ends.",
    dangerLevel: 10,
    abilities: ["Mind fracture", "Reality tear", "Void consumption"],
    color: "oklch(0.40 0.15 200)",
  },
  {
    id: "ancient-god",
    name: "Ancient God",
    tier: "cosmic",
    description:
      "The original rulers of existence. Deposed and imprisoned when God went silent. Now free — and furious. They remember when they were worshipped.",
    dangerLevel: 10,
    abilities: ["Divine dominion", "Timeline collapse", "Soul consumption"],
    color: "oklch(0.65 0.22 60)",
  },
  {
    id: "celestial-guardian",
    name: "Celestial Guardian",
    tier: "boss",
    description:
      "Heaven's last line of defense. Armored in divine gold, wielding weapons that can unmake reality. They have stood at the gates since before time began.",
    dangerLevel: 9,
    abilities: ["Holy judgment", "Gate sealing", "Divine shield"],
    color: "oklch(0.80 0.18 60)",
  },
];

export const combatSections: CombatSection[] = [
  {
    id: "weapons",
    title: "Arsenal",
    subtitle: "Every weapon forged for a different kind of war",
    items: [
      {
        id: "divine-blade",
        name: "Divine Blade",
        category: "melee",
        description:
          "Ancient sword imbued with celestial energy. Slices through dimensional barriers.",
        icon: "⚔️",
        color: "oklch(0.65 0.22 60)",
      },
      {
        id: "phantom-gun",
        name: "Phantom Rifle",
        category: "ranged",
        description:
          "Fires rounds that phase through cover to strike the soul directly.",
        icon: "🔫",
        color: "oklch(0.55 0.18 200)",
      },
      {
        id: "void-cannon",
        name: "Void Cannon",
        category: "ranged",
        description:
          "Energy weapon that fires compressed dimensional voids. Erases what it touches.",
        icon: "💫",
        color: "oklch(0.45 0.20 270)",
      },
      {
        id: "titan-hammer",
        name: "Titan Hammer",
        category: "melee",
        description:
          "Forged from titan bone. Each strike reshapes the terrain in a radius of devastation.",
        icon: "🔨",
        color: "oklch(0.50 0.18 40)",
      },
    ],
  },
  {
    id: "combat",
    title: "Combat System",
    subtitle: "Fluid, brutal, cinematic — every fight is a statement",
    items: [
      {
        id: "aerial-combat",
        name: "Aerial Combat",
        category: "melee",
        description:
          "Take the fight skyward. Launch, slam, and aerial execute with devastating gravity.",
        icon: "🦅",
        color: "oklch(0.65 0.20 200)",
      },
      {
        id: "counter-system",
        name: "Counter Strike",
        category: "melee",
        description:
          "Perfect timing triggers cinematic counter sequences that devastate even bosses.",
        icon: "⚡",
        color: "oklch(0.65 0.22 60)",
      },
      {
        id: "execution",
        name: "Divine Execution",
        category: "divine",
        description:
          "Finish weakened enemies with brutal, cinematic execution animations unique to each type.",
        icon: "✦",
        color: "oklch(0.70 0.22 60)",
      },
      {
        id: "dodge-system",
        name: "Phantom Dodge",
        category: "cosmic",
        description:
          "Phase through attacks leaving an energy afterimage. Chain dodges into devastating counters.",
        icon: "💨",
        color: "oklch(0.60 0.15 280)",
      },
    ],
  },
  {
    id: "powers",
    title: "Divine Powers",
    subtitle: "Abilities stolen from gods — and earned through transcendence",
    items: [
      {
        id: "lightning-dash",
        name: "Lightning Dash",
        category: "divine",
        description:
          "Teleport through space in a bolt of divine gold. Strike from impossible angles.",
        icon: "⚡",
        color: "oklch(0.75 0.22 60)",
      },
      {
        id: "gravity-pull",
        name: "Gravity Dominion",
        category: "cosmic",
        description:
          "Bend gravitational fields to suspend enemies, redirect projectiles, and reshape the battlefield.",
        icon: "🌀",
        color: "oklch(0.55 0.20 270)",
      },
      {
        id: "time-slow",
        name: "Temporal Fracture",
        category: "cosmic",
        description:
          "Slow time to a crawl for all but yourself. Navigate the frozen battlefield with godlike precision.",
        icon: "⏳",
        color: "oklch(0.65 0.18 200)",
      },
      {
        id: "celestial-blast",
        name: "Celestial Eruption",
        category: "divine",
        description:
          "Channel pure divine energy into a reality-tearing blast that obliterates everything in its path.",
        icon: "✨",
        color: "oklch(0.80 0.20 60)",
      },
    ],
  },
];
