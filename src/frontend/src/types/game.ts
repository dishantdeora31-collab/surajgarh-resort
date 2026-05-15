export interface StoryAct {
  number: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  icon: string;
  phase: string;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  features: string[];
  color: string;
  accentColor: string;
  image?: string;
}

export interface EvolutionStage {
  id: number;
  name: string;
  label: string;
  description: string;
  traits: string[];
  aura: string;
  glowColor: string;
}

export interface EnemyType {
  id: string;
  name: string;
  tier: "common" | "elite" | "boss" | "cosmic";
  description: string;
  dangerLevel: number;
  abilities: string[];
  color: string;
}

export interface AbilityCard {
  id: string;
  name: string;
  category: "melee" | "ranged" | "divine" | "cosmic";
  description: string;
  icon: string;
  color: string;
}

export interface CombatSection {
  id: string;
  title: string;
  subtitle: string;
  items: AbilityCard[];
}
