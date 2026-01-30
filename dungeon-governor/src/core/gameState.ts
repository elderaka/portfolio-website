export interface DungeonState {
  tick: number;
  gold: number;
  mana: number;
  reputation: number;
  rooms: Room[];
  traps: Trap[];
  monsters: Monster[];
  activeRuns: AdventurerRun[];
  completedRuns: RunHistory[];
  metrics: GameMetrics;
}

export interface Room {
  id: string;
  type: 'entry' | 'corridor' | 'treasure' | 'boss' | 'trap_room';
  position: { x: number; y: number };
  connections: string[];
  trapSlots: number;
  monsterCapacity: number;
  level: number;
}

export interface Trap {
  id: string;
  roomId: string;
  type: 'spike' | 'arrow' | 'fire' | 'poison' | 'magic';
  damage: number;
  triggerChance: number;
  goldCost: number;
  manaCost: number;
  status: 'active' | 'triggered' | 'disabled';
}

export interface Monster {
  id: string;
  roomId: string;
  type: 'goblin' | 'skeleton' | 'orc' | 'drake' | 'demon';
  hp: number;
  maxHp: number;
  damage: number;
  goldCost: number;
  behavior: 'aggressive' | 'defensive' | 'patrol';
}

export interface AdventurerRun {
  id: string;
  adventurer: Adventurer;
  currentRoom: string;
  path: string[];
  status: 'active' | 'defeated' | 'escaped' | 'completed';
  goldCollected: number;
  damageDealt: number;
  damageTaken: number;
  startTick: number;
}

export interface Adventurer {
  id: string;
  class: 'warrior' | 'mage' | 'rogue' | 'cleric';
  level: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  abilities: string[];
  traits: string[];
  legalMoves: string[];
  policyBook: PolicyBook;
}

export interface PolicyBook {
  stats: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  proficiencies: string[];
  features: string[];
  budgets: {
    action: number;
    bonus: number;
    reaction: number;
    movement: number;
  };
  legalMoves: string[];
}

export interface GameMetrics {
  progress: number;
  diversity: number;
  violations: number;
  stalls: number;
  totalScore: number;
  entropy: number;
}

export interface GovernanceParams {
  alpha: number; // progress weight
  beta: number;  // diversity weight
  gamma: number; // violation penalty
  delta: number; // stall penalty
}

export const DEFAULT_GOVERNANCE: GovernanceParams = {
  alpha: 1.0,
  beta: 0.5,
  gamma: 0.8,
  delta: 0.3,
};

export function calculateScore(metrics: GameMetrics, params: GovernanceParams): number {
  return (
    params.alpha * metrics.progress +
    params.beta * metrics.diversity -
    params.gamma * metrics.violations -
    params.delta * metrics.stalls
  );
}
