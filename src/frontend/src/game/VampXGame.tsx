import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase =
  | "start"
  | "playing"
  | "wave-complete"
  | "boss-intro"
  | "game-over"
  | "victory";

interface Vec2 {
  x: number;
  y: number;
}

interface Player {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  speed: number;
  radius: number;
  evolutionStage: number;
  angle: number;
  attackCooldown: number;
  powers: Power[];
  powerCooldowns: number[];
  invincibleTimer: number;
}

type EnemyType =
  | "CorruptedHuman"
  | "ShadowWraith"
  | "FallenAngel"
  | "GiantTitan"
  | "BiomechanicalDemon"
  | "AncientGod";

interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  radius: number;
  speed: number;
  damage: number;
  color: string;
  attackCooldown: number;
  ranged: boolean;
  rangedRange: number;
  isBoss: boolean;
  pulsePhase: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  fromPlayer: boolean;
  damage: number;
  life: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  type: "death" | "trail" | "nova" | "attack";
}

type PowerType = "LightningDash" | "TeleportStrike" | "GravitySlam";

interface Power {
  type: PowerType;
  label: string;
  key: string;
  cooldown: number;
  maxCooldown: number;
  description: string;
}

const POWER_DEFS: Record<PowerType, Omit<Power, "cooldown">> = {
  LightningDash: {
    type: "LightningDash",
    label: "DASH",
    key: "1",
    maxCooldown: 8000,
    description: "Teleport 150px in move direction",
  },
  TeleportStrike: {
    type: "TeleportStrike",
    label: "BLINK",
    key: "2",
    maxCooldown: 12000,
    description: "Blink to cursor, damage all nearby enemies",
  },
  GravitySlam: {
    type: "GravitySlam",
    label: "SLAM",
    key: "3",
    maxCooldown: 15000,
    description: "Shockwave pushes all enemies back",
  },
};

const ENEMY_DEFS: Record<
  EnemyType,
  {
    radius: number;
    speed: number;
    hp: number;
    damage: number;
    color: string;
    ranged: boolean;
    rangedRange: number;
    isBoss: boolean;
  }
> = {
  CorruptedHuman: {
    radius: 10,
    speed: 1.8,
    hp: 40,
    damage: 8,
    color: "#ff2244",
    ranged: false,
    rangedRange: 0,
    isBoss: false,
  },
  ShadowWraith: {
    radius: 12,
    speed: 1.2,
    hp: 70,
    damage: 12,
    color: "#8844ff",
    ranged: true,
    rangedRange: 200,
    isBoss: false,
  },
  FallenAngel: {
    radius: 14,
    speed: 0.9,
    hp: 120,
    damage: 20,
    color: "#44ffee",
    ranged: false,
    rangedRange: 0,
    isBoss: false,
  },
  GiantTitan: {
    radius: 40,
    speed: 0.6,
    hp: 400,
    damage: 30,
    color: "#ff6600",
    ranged: false,
    rangedRange: 0,
    isBoss: true,
  },
  BiomechanicalDemon: {
    radius: 35,
    speed: 0.8,
    hp: 700,
    damage: 45,
    color: "#33ff44",
    ranged: false,
    rangedRange: 0,
    isBoss: true,
  },
  AncientGod: {
    radius: 50,
    speed: 0.5,
    hp: 1200,
    damage: 60,
    color: "#ffcc00",
    ranged: true,
    rangedRange: 280,
    isBoss: true,
  },
};

const BOSS_WAVES: Record<number, EnemyType> = {
  5: "GiantTitan",
  10: "BiomechanicalDemon",
  15: "AncientGod",
};
const BOSS_NAMES: Record<EnemyType, string> = {
  GiantTitan: "THE GIANT TITAN",
  BiomechanicalDemon: "BIOMECHANICAL DEMON",
  AncientGod: "THE ANCIENT GOD",
  CorruptedHuman: "",
  ShadowWraith: "",
  FallenAngel: "",
};

const STAGE_COLORS = [
  "#c8921a", // stage 1 — amber
  "#cd7f32", // stage 2 — bronze
  "#8844ff", // stage 3 — cosmic purple
  "#44cccc", // stage 4 — empyrean teal
  "#d4af37", // stage 5 — divine gold
];

const POWER_CHOICES: PowerType[][] = [
  ["LightningDash", "TeleportStrike", "GravitySlam"],
  ["LightningDash", "GravitySlam", "TeleportStrike"],
  ["TeleportStrike", "LightningDash", "GravitySlam"],
  ["GravitySlam", "TeleportStrike", "LightningDash"],
  ["LightningDash", "TeleportStrike", "GravitySlam"],
  ["TeleportStrike", "GravitySlam", "LightningDash"],
  ["GravitySlam", "LightningDash", "TeleportStrike"],
  ["LightningDash", "GravitySlam", "TeleportStrike"],
  ["TeleportStrike", "LightningDash", "GravitySlam"],
  ["GravitySlam", "TeleportStrike", "LightningDash"],
  ["LightningDash", "TeleportStrike", "GravitySlam"],
  ["TeleportStrike", "GravitySlam", "LightningDash"],
  ["GravitySlam", "LightningDash", "TeleportStrike"],
  ["LightningDash", "GravitySlam", "TeleportStrike"],
];

const TOTAL_WAVES = 15;
let _nextId = 1;
function nextId() {
  return _nextId++;
}

// ─── Game State ───────────────────────────────────────────────────────────────

interface GameState {
  phase: GamePhase;
  wave: number;
  score: number;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  stars: Vec2[];
  mousePos: Vec2;
  keysHeld: Set<string>;
  attackEffect: { x: number; y: number; angle: number; life: number } | null;
  waveTimer: number;
  bossIntroTimer: number;
  bossIntroName: string;
  selectedPowerIndex: number;
  autoAdvanceTimer: number;
  novaFlash: number;
  powerChoices: PowerType[];
  waveEnemiesSpawned: number;
  spawnTimer: number;
}

function makeStars(count: number): Vec2[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 3000,
    y: Math.random() * 2000,
  }));
}

function makePlayer(cw: number, ch: number): Player {
  return {
    x: cw / 2,
    y: ch / 2,
    hp: 100,
    maxHp: 100,
    energy: 0,
    maxEnergy: 100,
    speed: 3,
    radius: 12,
    evolutionStage: 1,
    angle: 0,
    attackCooldown: 0,
    powers: [],
    powerCooldowns: [],
    invincibleTimer: 0,
  };
}

function initialState(cw: number, ch: number): GameState {
  return {
    phase: "start",
    wave: 1,
    score: 0,
    player: makePlayer(cw, ch),
    enemies: [],
    projectiles: [],
    particles: [],
    stars: makeStars(80),
    mousePos: { x: cw / 2, y: ch / 2 },
    keysHeld: new Set(),
    attackEffect: null,
    waveTimer: 0,
    bossIntroTimer: 0,
    bossIntroName: "",
    selectedPowerIndex: -1,
    autoAdvanceTimer: 5000,
    novaFlash: 0,
    powerChoices: POWER_CHOICES[0],
    waveEnemiesSpawned: 0,
    spawnTimer: 0,
  };
}

// ─── Spawn helpers ────────────────────────────────────────────────────────────

function spawnEnemy(type: EnemyType, cw: number, ch: number): Enemy {
  const def = ENEMY_DEFS[type];
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  if (side === 0) {
    x = Math.random() * cw;
    y = -def.radius - 10;
  } else if (side === 1) {
    x = cw + def.radius + 10;
    y = Math.random() * ch;
  } else if (side === 2) {
    x = Math.random() * cw;
    y = ch + def.radius + 10;
  } else {
    x = -def.radius - 10;
    y = Math.random() * ch;
  }
  return {
    id: nextId(),
    type,
    x,
    y,
    hp: def.hp,
    maxHp: def.hp,
    radius: def.radius,
    speed: def.speed,
    damage: def.damage,
    color: def.color,
    attackCooldown: 0,
    ranged: def.ranged,
    rangedRange: def.rangedRange,
    isBoss: def.isBoss,
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

function enemiesForWave(wave: number): EnemyType[] {
  if (BOSS_WAVES[wave]) return [BOSS_WAVES[wave]];
  const types: EnemyType[] = ["CorruptedHuman"];
  if (wave >= 3) types.push("ShadowWraith");
  if (wave >= 6) types.push("FallenAngel");
  const count = 5 + wave * 2;
  return Array.from(
    { length: count },
    () => types[Math.floor(Math.random() * types.length)],
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VampXGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [_displayPhase, setDisplayPhase] = useState<GamePhase>("start");

  // ── Canvas resize ──────────────────────────────────────────────────────────

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // ── Initialize ─────────────────────────────────────────────────────────────

  const initGame = useCallback((cw: number, ch: number) => {
    stateRef.current = initialState(cw, ch);
  }, []);

  const _startWave = useCallback((wave: number) => {
    const s = stateRef.current;
    if (!s) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const isBossWave = !!BOSS_WAVES[wave];

    if (isBossWave) {
      s.phase = "boss-intro";
      s.bossIntroTimer = 5000;
      s.bossIntroName = BOSS_NAMES[BOSS_WAVES[wave]];
      // Queue enemies for after intro
      s.enemies = [spawnEnemy(BOSS_WAVES[wave], cw, ch)];
      s.waveEnemiesSpawned = 1;
    } else {
      s.phase = "playing";
      s.enemies = [];
      s.waveEnemiesSpawned = 0;
      s.spawnTimer = 0;
    }
    s.projectiles = [];
    s.attackEffect = null;
    s.wave = wave;
    s.player.evolutionStage =
      wave <= 3 ? 1 : wave <= 6 ? 2 : wave <= 9 ? 3 : wave <= 12 ? 4 : 5;
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────

  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const cw = canvas.width;
    const ch = canvas.height;

    update(s, dt, cw, ch);
    render(ctx, s, cw, ch, timestamp);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // ── Update ─────────────────────────────────────────────────────────────────

  function update(s: GameState, dt: number, cw: number, ch: number) {
    if (s.phase === "start" || s.phase === "game-over" || s.phase === "victory")
      return;

    if (s.phase === "boss-intro") {
      s.bossIntroTimer -= dt;
      if (s.bossIntroTimer <= 0) {
        s.phase = "playing";
      }
      return;
    }

    if (s.phase === "wave-complete") {
      s.autoAdvanceTimer -= dt;
      if (s.autoAdvanceTimer <= 0) {
        applyPowerChoice(
          s,
          s.selectedPowerIndex >= 0 ? s.selectedPowerIndex : 0,
        );
        startNextWave(s, cw, ch);
      }
      return;
    }

    // --- Phase: playing ---
    const p = s.player;
    const dtS = dt / 1000;

    // Movement
    const k = s.keysHeld;
    let dx = 0;
    let dy = 0;
    if (k.has("a") || k.has("arrowleft")) dx -= 1;
    if (k.has("d") || k.has("arrowright")) dx += 1;
    if (k.has("w") || k.has("arrowup")) dy -= 1;
    if (k.has("s") || k.has("arrowdown")) dy += 1;
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }
    p.x = Math.max(p.radius, Math.min(cw - p.radius, p.x + dx * p.speed));
    p.y = Math.max(p.radius, Math.min(ch - p.radius, p.y + dy * p.speed));

    // Facing angle toward mouse
    p.angle = Math.atan2(s.mousePos.y - p.y, s.mousePos.x - p.x);

    // Attack cooldown
    if (p.attackCooldown > 0) p.attackCooldown -= dt;
    if (p.invincibleTimer > 0) p.invincibleTimer -= dt;

    // Power cooldowns
    p.powers.forEach((_, i) => {
      if (p.powerCooldowns[i] > 0) p.powerCooldowns[i] -= dt;
    });

    // Attack effect fade
    if (s.attackEffect) {
      s.attackEffect.life -= dt;
      if (s.attackEffect.life <= 0) s.attackEffect = null;
    }

    // Nova flash fade
    if (s.novaFlash > 0) s.novaFlash -= dt;

    // Spawn enemies over time (non-boss waves)
    const bossWave = !!BOSS_WAVES[s.wave];
    if (!bossWave) {
      const target = enemiesForWave(s.wave);
      if (s.waveEnemiesSpawned < target.length) {
        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          s.enemies.push(spawnEnemy(target[s.waveEnemiesSpawned], cw, ch));
          s.waveEnemiesSpawned++;
          s.spawnTimer = 800 + Math.random() * 600;
        }
      }
    }

    // Update enemies
    for (const e of s.enemies) {
      e.pulsePhase += dtS * 2;
      const ddx = p.x - e.x;
      const ddy = p.y - e.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);

      if (e.ranged && dist < e.rangedRange) {
        // Ranged: maintain distance and shoot
        if (dist < e.rangedRange * 0.6) {
          e.x -= (ddx / dist) * e.speed;
          e.y -= (ddy / dist) * e.speed;
        }
        e.attackCooldown -= dt;
        if (e.attackCooldown <= 0) {
          e.attackCooldown = 2000 + Math.random() * 1000;
          const speed = 3.5;
          s.projectiles.push({
            id: nextId(),
            x: e.x,
            y: e.y,
            vx: (ddx / dist) * speed,
            vy: (ddy / dist) * speed,
            radius: 5,
            color: e.color,
            fromPlayer: false,
            damage: e.damage,
            life: 3000,
          });
        }
      } else {
        // Melee: move toward player
        if (dist > 0) {
          e.x += (ddx / dist) * e.speed;
          e.y += (ddy / dist) * e.speed;
        }
        // Melee damage on overlap
        if (dist < p.radius + e.radius) {
          e.attackCooldown -= dt;
          if (e.attackCooldown <= 0) {
            e.attackCooldown = 1200;
            if (p.invincibleTimer <= 0) {
              p.hp -= e.damage;
              p.invincibleTimer = 600;
              // Flash particle
              spawnParticles(s, p.x, p.y, "#ff2244", 6, "death");
            }
          }
        }
      }
    }

    // Update projectiles
    s.projectiles = s.projectiles.filter((proj) => {
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.life -= dt;
      if (proj.life <= 0) return false;
      if (proj.x < 0 || proj.x > cw || proj.y < 0 || proj.y > ch) return false;

      if (!proj.fromPlayer) {
        const dist = Math.hypot(p.x - proj.x, p.y - proj.y);
        if (dist < p.radius + proj.radius) {
          if (p.invincibleTimer <= 0) {
            p.hp -= proj.damage;
            p.invincibleTimer = 400;
            spawnParticles(s, p.x, p.y, "#ff2244", 5, "death");
          }
          return false;
        }
      }
      return true;
    });

    // Update particles
    s.particles = s.particles.filter((part) => {
      part.x += part.vx;
      part.y += part.vy;
      part.life -= dt;
      part.vx *= 0.96;
      part.vy *= 0.96;
      return part.life > 0;
    });

    // Check deaths
    const _beforeCount = s.enemies.length;
    s.enemies = s.enemies.filter((e) => {
      if (e.hp <= 0) {
        spawnParticles(s, e.x, e.y, e.color, e.isBoss ? 24 : 10, "death");
        s.score += e.isBoss ? 500 : 50;
        p.energy = Math.min(p.maxEnergy, p.energy + 20);
        return false;
      }
      return true;
    });

    const allSpawned = !bossWave
      ? s.waveEnemiesSpawned >= enemiesForWave(s.wave).length
      : true;

    if (s.enemies.length === 0 && allSpawned) {
      if (s.wave >= TOTAL_WAVES) {
        s.phase = "victory";
      } else {
        s.phase = "wave-complete";
        s.autoAdvanceTimer = 5000;
        s.selectedPowerIndex = -1;
        const choiceSet = POWER_CHOICES[(s.wave - 1) % POWER_CHOICES.length];
        s.powerChoices = choiceSet;
      }
    }

    // Player death
    if (p.hp <= 0) {
      p.hp = 0;
      s.phase = "game-over";
    }

    setDisplayPhase(s.phase);
  }

  function startNextWave(s: GameState, cw: number, ch: number) {
    const next = s.wave + 1;
    s.enemies = [];
    s.projectiles = [];
    s.particles = [];
    s.attackEffect = null;
    s.waveEnemiesSpawned = 0;
    s.spawnTimer = 500;
    s.wave = next;
    s.player.evolutionStage =
      next <= 3 ? 1 : next <= 6 ? 2 : next <= 9 ? 3 : next <= 12 ? 4 : 5;

    const isBossWave = !!BOSS_WAVES[next];
    if (isBossWave) {
      s.phase = "boss-intro";
      s.bossIntroTimer = 5000;
      s.bossIntroName = BOSS_NAMES[BOSS_WAVES[next]];
      s.enemies = [spawnEnemy(BOSS_WAVES[next], cw, ch)];
      s.waveEnemiesSpawned = 1;
    } else {
      s.phase = "playing";
    }
  }

  function applyPowerChoice(s: GameState, index: number) {
    const choice = s.powerChoices[index];
    if (!choice) return;
    const def = POWER_DEFS[choice];
    const existingIdx = s.player.powers.findIndex((pw) => pw.type === choice);
    if (existingIdx === -1 && s.player.powers.length < 3) {
      s.player.powers.push({ ...def, cooldown: 0 });
      s.player.powerCooldowns.push(0);
    }
  }

  function spawnParticles(
    s: GameState,
    x: number,
    y: number,
    color: string,
    count: number,
    type: Particle["type"],
  ) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      s.particles.push({
        id: nextId(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        color,
        life: 400 + Math.random() * 600,
        maxLife: 1000,
        type,
      });
    }
  }

  function activatePower(s: GameState, index: number, cw: number, ch: number) {
    const p = s.player;
    if (index >= p.powers.length) return;
    const power = p.powers[index];
    if (p.powerCooldowns[index] > 0) return;

    const k = s.keysHeld;
    let mvx = 0;
    let mvy = 0;
    if (k.has("a") || k.has("arrowleft")) mvx -= 1;
    if (k.has("d") || k.has("arrowright")) mvx += 1;
    if (k.has("w") || k.has("arrowup")) mvy -= 1;
    if (k.has("s") || k.has("arrowdown")) mvy += 1;
    if (mvx === 0 && mvy === 0) {
      mvx = Math.cos(p.angle);
      mvy = Math.sin(p.angle);
    }
    const len = Math.sqrt(mvx * mvx + mvy * mvy);
    mvx /= len;
    mvy /= len;

    if (power.type === "LightningDash") {
      const tx = Math.max(p.radius, Math.min(cw - p.radius, p.x + mvx * 150));
      const ty = Math.max(p.radius, Math.min(ch - p.radius, p.y + mvy * 150));
      // Trail
      for (let i = 0; i < 8; i++) {
        spawnParticles(
          s,
          p.x + (tx - p.x) * (i / 8),
          p.y + (ty - p.y) * (i / 8),
          "#aaff00",
          2,
          "trail",
        );
      }
      p.x = tx;
      p.y = ty;
      p.powerCooldowns[index] = power.maxCooldown;
    } else if (power.type === "TeleportStrike") {
      const tx = Math.max(p.radius, Math.min(cw - p.radius, s.mousePos.x));
      const ty = Math.max(p.radius, Math.min(ch - p.radius, s.mousePos.y));
      p.x = tx;
      p.y = ty;
      spawnParticles(s, p.x, p.y, "#8844ff", 16, "nova");
      for (const e of s.enemies) {
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < 80) e.hp -= 60;
      }
      p.powerCooldowns[index] = power.maxCooldown;
    } else if (power.type === "GravitySlam") {
      spawnParticles(s, p.x, p.y, "#44ccff", 24, "nova");
      for (const e of s.enemies) {
        const ddx = e.x - p.x;
        const ddy = e.y - p.y;
        const dist = Math.max(1, Math.sqrt(ddx * ddx + ddy * ddy));
        e.x += (ddx / dist) * 200;
        e.y += (ddy / dist) * 200;
        e.hp -= 50;
      }
      p.powerCooldowns[index] = power.maxCooldown;
    }
  }

  function activateCelestialNova(s: GameState) {
    const p = s.player;
    if (p.energy < p.maxEnergy) return;
    for (const e of s.enemies) e.hp -= 100;
    spawnParticles(s, p.x, p.y, "#d4af37", 40, "nova");
    p.energy = 0;
    s.novaFlash = 400;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function render(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
    ts: number,
  ) {
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, cw, ch);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (const star of s.stars) {
      const sx = star.x % cw;
      const sy = star.y % ch;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    if (s.phase === "start") {
      renderStart(ctx, cw, ch, ts);
      return;
    }
    if (s.phase === "boss-intro") {
      renderBossIntro(ctx, s, cw, ch, ts);
      return;
    }
    if (s.phase === "game-over") {
      renderGameOver(ctx, s, cw, ch, ts);
      return;
    }
    if (s.phase === "victory") {
      renderVictory(ctx, s, cw, ch, ts);
      return;
    }
    if (s.phase === "wave-complete") {
      renderWaveComplete(ctx, s, cw, ch, ts);
      return;
    }

    // ── Playing ──
    // Particles (below everything)
    for (const part of s.particles) {
      const alpha = part.life / part.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Attack arc
    if (s.attackEffect) {
      const life = s.attackEffect.life / 200;
      ctx.globalAlpha = life * 0.7;
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        s.attackEffect.x,
        s.attackEffect.y,
        55,
        s.attackEffect.angle - 0.6,
        s.attackEffect.angle + 0.6,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Enemies
    for (const e of s.enemies) {
      // Glow
      const pulse = Math.sin(e.pulsePhase) * 0.3 + 0.7;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = e.isBoss ? 30 * pulse : 12;
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // HP bar
      const barW = e.radius * 2.5;
      const barX = e.x - barW / 2;
      const barY = e.y - e.radius - 8;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(barX, barY, barW, 4);
      ctx.fillStyle = e.hp / e.maxHp > 0.4 ? "#33ff44" : "#ff2244";
      ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), 4);
    }

    // Projectiles
    for (const proj of s.projectiles) {
      ctx.shadowColor = proj.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Player
    const p = s.player;
    const stageColor = STAGE_COLORS[p.evolutionStage - 1];
    const blink =
      p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 80) % 2 === 0;
    if (!blink) {
      // Outer glow ring
      ctx.shadowColor = stageColor;
      ctx.shadowBlur = 20 + p.evolutionStage * 4;
      ctx.strokeStyle = stageColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 6 + p.evolutionStage * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Inner fill
      ctx.fillStyle = stageColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      // Direction indicator
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(
        p.x + Math.cos(p.angle) * (p.radius + 10),
        p.y + Math.sin(p.angle) * (p.radius + 10),
      );
      ctx.stroke();
    }

    // Nova flash
    if (s.novaFlash > 0) {
      ctx.fillStyle = `rgba(212,175,55,${(s.novaFlash / 400) * 0.4})`;
      ctx.fillRect(0, 0, cw, ch);
    }

    // HUD
    renderHUD(ctx, s, cw, ch);
  }

  function renderHUD(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
  ) {
    const p = s.player;
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";

    // Top-left: Wave
    ctx.fillStyle = "#d4af37";
    ctx.shadowColor = "#d4af37";
    ctx.shadowBlur = 8;
    ctx.fillText(`WAVE ${s.wave} / ${TOTAL_WAVES}`, 20, 34);
    ctx.shadowBlur = 0;

    // Top-center: HP bar
    const hbW = 220;
    const hbH = 16;
    const hbX = cw / 2 - hbW / 2;
    const hbY = 14;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(hbX - 2, hbY - 2, hbW + 4, hbH + 4);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hbX - 2, hbY - 2, hbW + 4, hbH + 4);
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(hbX, hbY, hbW * (p.hp / p.maxHp), hbH);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 11px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(p.hp)} / ${p.maxHp}`, cw / 2, hbY + 12);
    ctx.textAlign = "left";

    // Top-right: enemies remaining
    ctx.font = "bold 14px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    const remaining = s.enemies.length;
    const text = `ENEMIES: ${remaining}`;
    ctx.textAlign = "right";
    ctx.fillText(text, cw - 20, 34);
    ctx.textAlign = "left";

    // Bottom-center: Powers
    const pwCount = p.powers.length;
    if (pwCount > 0) {
      const pw_r = 28;
      const pw_spacing = 80;
      const pw_y = ch - 55;
      const totalW = pwCount * pw_spacing;
      const startX = cw / 2 - totalW / 2 + pw_spacing / 2;
      for (let i = 0; i < pwCount; i++) {
        const pw = p.powers[i];
        const cd = p.powerCooldowns[i];
        const cx_ = startX + i * pw_spacing;
        const ready = cd <= 0;
        ctx.fillStyle = ready ? "rgba(212,175,55,0.25)" : "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.arc(cx_, pw_y, pw_r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = ready ? "#d4af37" : "rgba(212,175,55,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx_, pw_y, pw_r, 0, Math.PI * 2);
        ctx.stroke();
        if (!ready) {
          // Cooldown arc
          ctx.strokeStyle = "#d4af37";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            cx_,
            pw_y,
            pw_r,
            -Math.PI / 2,
            -Math.PI / 2 + Math.PI * 2 * (1 - cd / pw.maxCooldown),
          );
          ctx.stroke();
        }
        ctx.fillStyle = ready ? "#d4af37" : "rgba(255,255,255,0.4)";
        ctx.font = "bold 11px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pw.label, cx_, pw_y + 4);
        ctx.font = "10px 'DM Sans', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(`[${pw.key}]`, cx_, pw_y + 18);
        ctx.textAlign = "left";
      }
    }

    // Bottom-right: Energy bar
    const ebW = 150;
    const ebH = 14;
    const ebX = cw - ebW - 20;
    const ebY = ch - 38;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(ebX - 2, ebY - 2, ebW + 4, ebH + 4);
    ctx.strokeStyle = "rgba(212,175,55,0.6)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ebX - 2, ebY - 2, ebW + 4, ebH + 4);
    const energyFrac = p.energy / p.maxEnergy;
    if (energyFrac > 0) {
      ctx.shadowColor = "#d4af37";
      ctx.shadowBlur = energyFrac >= 1 ? 16 : 4;
      ctx.fillStyle = energyFrac >= 1 ? "#d4af37" : "rgba(212,175,55,0.7)";
      ctx.fillRect(ebX, ebY, ebW * energyFrac, ebH);
      ctx.shadowBlur = 0;
    }
    ctx.font = "bold 10px 'DM Sans', sans-serif";
    ctx.fillStyle = energyFrac >= 1 ? "#d4af37" : "rgba(255,255,255,0.6)";
    ctx.textAlign = "right";
    ctx.fillText(
      energyFrac >= 1
        ? "NOVA READY [Q]"
        : `NOVA ${Math.floor(energyFrac * 100)}%`,
      cw - 20,
      ebY - 6,
    );
    ctx.textAlign = "left";

    // Score
    ctx.font = "14px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(`SCORE: ${s.score.toLocaleString()}`, 20, ch - 20);

    // Controls hint (stage 1 only)
    if (s.player.evolutionStage === 1 && s.wave === 1) {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "12px 'DM Sans', sans-serif";
      ctx.fillText(
        "WASD to move · Click to attack · Q for Celestial Nova",
        20,
        ch - 42,
      );
    }
  }

  function renderStart(
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    ts: number,
  ) {
    // Dramatic gradient bg
    const grad = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      0,
      cw / 2,
      ch / 2,
      Math.max(cw, ch) * 0.7,
    );
    grad.addColorStop(0, "rgba(50,20,0,0.8)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.shadowColor = "#d4af37";
    ctx.shadowBlur = 40;
    ctx.font = `bold ${Math.min(72, cw * 0.1)}px 'Space Grotesk', sans-serif`;
    ctx.fillText("VAMP-X: ASCENT", cw / 2, ch / 2 - 80);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${Math.min(22, cw * 0.035)}px 'DM Sans', sans-serif`;
    ctx.fillText("Fight. Evolve. Ascend.", cw / 2, ch / 2 - 30);

    // Flashing prompt
    const blink = Math.floor(ts / 600) % 2 === 0;
    if (blink) {
      ctx.fillStyle = "#d4af37";
      ctx.font = `bold ${Math.min(18, cw * 0.025)}px 'Space Grotesk', sans-serif`;
      ctx.fillText("PRESS ENTER OR CLICK TO BEGIN", cw / 2, ch / 2 + 40);
    }

    // Controls
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.fillText(
      "WASD · Move    Click · Attack    1/2/3 · Powers    Q · Celestial Nova",
      cw / 2,
      ch / 2 + 90,
    );

    // Caffeine attribution
    ctx.fillStyle = "rgba(212,175,55,0.35)";
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillText("Built with caffeine.ai", cw / 2, ch - 20);
    ctx.textAlign = "left";
  }

  function renderBossIntro(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
    _ts: number,
  ) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, cw, ch);
    const t = 1 - s.bossIntroTimer / 5000;
    const fadeIn = Math.min(1, t * 3);
    ctx.globalAlpha = fadeIn;
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.shadowColor = "#d4af37";
    ctx.shadowBlur = 60;
    ctx.font = `bold ${Math.min(52, cw * 0.07)}px 'Space Grotesk', sans-serif`;
    ctx.fillText(s.bossIntroName, cw / 2, ch / 2 - 20);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,60,60,0.8)";
    ctx.font = `${Math.min(22, cw * 0.03)}px 'DM Sans', sans-serif`;
    ctx.fillText("BOSS ENCOUNTER", cw / 2, ch / 2 + 30);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }

  function renderWaveComplete(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
    _ts: number,
  ) {
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.shadowColor = "#d4af37";
    ctx.shadowBlur = 30;
    ctx.font = `bold ${Math.min(48, cw * 0.065)}px 'Space Grotesk', sans-serif`;
    ctx.fillText(`WAVE ${s.wave} CLEARED`, cw / 2, ch / 2 - 160);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "16px 'DM Sans', sans-serif";
    ctx.fillText("CHOOSE A DIVINE POWER", cw / 2, ch / 2 - 110);

    const timer = Math.max(0, Math.ceil(s.autoAdvanceTimer / 1000));
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.fillText(`Auto-advance in ${timer}s`, cw / 2, ch / 2 - 85);

    // Power cards
    const cardW = Math.min(180, (cw - 80) / 3 - 16);
    const cardH = 120;
    const totalW = 3 * cardW + 2 * 16;
    const cardStartX = cw / 2 - totalW / 2;
    const cardY = ch / 2 - 60;

    for (let i = 0; i < 3; i++) {
      const ptype = s.powerChoices[i];
      const def = POWER_DEFS[ptype];
      const cx_ = cardStartX + i * (cardW + 16);
      const selected = s.selectedPowerIndex === i;
      ctx.fillStyle = selected ? "rgba(212,175,55,0.3)" : "rgba(30,20,50,0.8)";
      ctx.strokeStyle = selected ? "#d4af37" : "rgba(212,175,55,0.35)";
      ctx.lineWidth = selected ? 2.5 : 1.5;
      roundRect(ctx, cx_, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#d4af37";
      ctx.font = `bold ${Math.min(15, cardW * 0.085)}px 'Space Grotesk', sans-serif`;
      ctx.fillText(def.label, cx_ + cardW / 2, cardY + 28);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = `${Math.min(12, cardW * 0.07)}px 'DM Sans', sans-serif`;
      // Wrap text
      const words = def.description.split(" ");
      let line = "";
      let lineY = cardY + 52;
      for (const word of words) {
        const test = line + (line ? " " : "") + word;
        if (ctx.measureText(test).width > cardW - 16 && line) {
          ctx.fillText(line, cx_ + cardW / 2, lineY);
          line = word;
          lineY += 17;
        } else line = test;
      }
      if (line) ctx.fillText(line, cx_ + cardW / 2, lineY);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "11px 'DM Sans', sans-serif";
      ctx.fillText(
        `[${def.key}] to select`,
        cx_ + cardW / 2,
        cardY + cardH - 12,
      );
    }
    ctx.textAlign = "left";
  }

  function renderGameOver(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
    ts: number,
  ) {
    ctx.fillStyle = "rgba(100,0,0,0.55)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff2244";
    ctx.shadowColor = "#ff2244";
    ctx.shadowBlur = 40;
    ctx.font = `bold ${Math.min(72, cw * 0.1)}px 'Space Grotesk', sans-serif`;
    ctx.fillText("FALLEN", cw / 2, ch / 2 - 60);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "20px 'DM Sans', sans-serif";
    ctx.fillText(
      `REACHED WAVE ${s.wave}  ·  SCORE: ${s.score.toLocaleString()}`,
      cw / 2,
      ch / 2 + 10,
    );
    const blink = Math.floor(ts / 700) % 2 === 0;
    if (blink) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "bold 18px 'Space Grotesk', sans-serif";
      ctx.fillText("CLICK TO RESTART", cw / 2, ch / 2 + 70);
    }
    ctx.textAlign = "left";
  }

  function renderVictory(
    ctx: CanvasRenderingContext2D,
    s: GameState,
    cw: number,
    ch: number,
    ts: number,
  ) {
    const grad = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      0,
      cw / 2,
      ch / 2,
      cw * 0.6,
    );
    grad.addColorStop(0, "rgba(100,80,0,0.7)");
    grad.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.shadowColor = "#d4af37";
    ctx.shadowBlur = 60;
    ctx.font = `bold ${Math.min(80, cw * 0.11)}px 'Space Grotesk', sans-serif`;
    ctx.fillText("ASCENDED", cw / 2, ch / 2 - 80);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "20px 'DM Sans', sans-serif";
    ctx.fillText("You have transcended humanity", cw / 2, ch / 2 - 20);
    ctx.fillStyle = "rgba(212,175,55,0.7)";
    ctx.font = "16px 'DM Sans', sans-serif";
    ctx.fillText(
      `FINAL SCORE: ${s.score.toLocaleString()}`,
      cw / 2,
      ch / 2 + 20,
    );
    const blink = Math.floor(ts / 700) % 2 === 0;
    if (blink) {
      ctx.fillStyle = "#d4af37";
      ctx.font = "bold 18px 'Space Grotesk', sans-serif";
      ctx.fillText("CLICK TO PLAY AGAIN", cw / 2, ch / 2 + 70);
    }
    ctx.textAlign = "left";
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Effect Hooks ───────────────────────────────────────────────────────────

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable ref-only helper functions defined inside component
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resizeCanvas();
    initGame(canvas.width, canvas.height);

    const handleResize = () => {
      resizeCanvas();
      const s = stateRef.current;
      if (s) {
        const cw = canvas.width;
        const ch = canvas.height;
        if (
          s.phase === "start" ||
          s.phase === "game-over" ||
          s.phase === "victory"
        ) {
          s.player.x = cw / 2;
          s.player.y = ch / 2;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const key = e.key.toLowerCase();
      s.keysHeld.add(key);

      if (s.phase === "start" && key === "enter") {
        s.phase = "playing";
        s.enemies = [];
        s.waveEnemiesSpawned = 0;
        s.spawnTimer = 0;
      }
      if (s.phase === "wave-complete") {
        if (key === "1") {
          s.selectedPowerIndex = 0;
          applyPowerChoice(s, 0);
          startNextWave(s, canvas.width, canvas.height);
        }
        if (key === "2") {
          s.selectedPowerIndex = 1;
          applyPowerChoice(s, 1);
          startNextWave(s, canvas.width, canvas.height);
        }
        if (key === "3") {
          s.selectedPowerIndex = 2;
          applyPowerChoice(s, 2);
          startNextWave(s, canvas.width, canvas.height);
        }
      }
      if (s.phase === "playing") {
        if (key === "1") activatePower(s, 0, canvas.width, canvas.height);
        if (key === "2") activatePower(s, 1, canvas.width, canvas.height);
        if (key === "3") activatePower(s, 2, canvas.width, canvas.height);
        if (key === "q") activateCelestialNova(s);
      }
      // Prevent page scroll on game keys
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " ",
        ].includes(key)
      ) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s) return;
      s.keysHeld.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const rect = canvas.getBoundingClientRect();
      s.mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (s.phase === "start") {
        s.phase = "playing";
        s.enemies = [];
        s.waveEnemiesSpawned = 0;
        s.spawnTimer = 0;
        return;
      }
      if (s.phase === "game-over" || s.phase === "victory") {
        const cw = canvas.width;
        const ch = canvas.height;
        stateRef.current = initialState(cw, ch);
        return;
      }
      if (s.phase === "wave-complete") {
        // Check power card clicks
        const cardW = Math.min(180, (canvas.width - 80) / 3 - 16);
        const cardH = 120;
        const totalW = 3 * cardW + 2 * 16;
        const cardStartX = canvas.width / 2 - totalW / 2;
        const cardY = canvas.height / 2 - 60;
        for (let i = 0; i < 3; i++) {
          const cx_ = cardStartX + i * (cardW + 16);
          if (
            mx >= cx_ &&
            mx <= cx_ + cardW &&
            my >= cardY &&
            my <= cardY + cardH
          ) {
            s.selectedPowerIndex = i;
            applyPowerChoice(s, i);
            startNextWave(s, canvas.width, canvas.height);
            return;
          }
        }
        return;
      }
      if (s.phase === "playing" && s.player.attackCooldown <= 0) {
        const p = s.player;
        const angle = Math.atan2(my - p.y, mx - p.x);
        s.attackEffect = { x: p.x, y: p.y, angle, life: 200 };
        p.attackCooldown = 500;
        // Hit enemies in melee range
        const ATTACK_RANGE = 60;
        for (const e of s.enemies) {
          const dist = Math.hypot(e.x - p.x, e.y - p.y);
          const eAngle = Math.atan2(e.y - p.y, e.x - p.x);
          let angleDiff = Math.abs(eAngle - angle);
          if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
          if (dist <= ATTACK_RANGE + e.radius && angleDiff < 0.75) {
            e.hp -= 25;
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gameLoop, initGame, resizeCanvas]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0f",
        cursor: "crosshair",
      }}
      data-ocid="vampx.canvas_target"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        tabIndex={0}
        aria-label="VAMP-X: ASCENT game canvas"
      />
    </div>
  );
}
