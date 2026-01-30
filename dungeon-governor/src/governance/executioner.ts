import { DungeonState, AdventurerRun, Monster } from '../core/gameState';
import { Intent } from './jury';

export interface StateDiff {
  tick: number;
  intentsApplied: string[];
  changes: StateChange[];
  timestamp: number;
}

export interface StateChange {
  type: 'position' | 'health' | 'resource' | 'status' | 'metric';
  entityId: string;
  field: string;
  oldValue: any;
  newValue: any;
}

export class Executioner {
  private appliedIds: Set<string> = new Set();
  private diffLog: StateDiff[] = [];

  executeIntents(intents: Intent[], state: DungeonState): StateDiff {
    const conflictFree = this.selectConflictFree(intents, state);
    const changes: StateChange[] = [];

    for (const intent of conflictFree) {
      if (this.appliedIds.has(intent.id)) {
        continue;
      }

      const intentChanges = this.applyIntent(intent, state);
      changes.push(...intentChanges);
      this.appliedIds.add(intent.id);
    }

    const diff: StateDiff = {
      tick: state.tick,
      intentsApplied: conflictFree.map(i => i.id),
      changes,
      timestamp: Date.now(),
    };

    this.diffLog.push(diff);
    return diff;
  }

  private selectConflictFree(intents: Intent[], state: DungeonState): Intent[] {
    const selected: Intent[] = [];
    const used = new Set<string>();

    const sorted = [...intents].sort((a, b) => {
      const costA = this.calculateCost(a, state);
      const costB = this.calculateCost(b, state);
      return costA - costB;
    });

    for (const intent of sorted) {
      const key = `${intent.agentId}-${intent.action}`;
      if (!used.has(key)) {
        selected.push(intent);
        used.add(key);
      }
    }

    return selected;
  }

  private calculateCost(intent: Intent, state: DungeonState): number {
    let cost = 1;

    if (intent.action === 'Attack') cost += 2;
    if (intent.action === 'Dash') cost += 1;

    return cost;
  }

  private applyIntent(intent: Intent, state: DungeonState): StateChange[] {
    const changes: StateChange[] = [];

    switch (intent.action) {
      case 'Move':
        changes.push(...this.applyMove(intent, state));
        break;
      case 'Attack':
        changes.push(...this.applyAttack(intent, state));
        break;
      case 'Interact':
        changes.push(...this.applyInteract(intent, state));
        break;
      case 'Dash':
        changes.push(...this.applyDash(intent, state));
        break;
    }

    return changes;
  }

  private applyMove(intent: Intent, state: DungeonState): StateChange[] {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run || !intent.target) return [];

    const oldRoom = run.currentRoom;
    run.currentRoom = intent.target;
    run.path.push(intent.target);

    return [{
      type: 'position',
      entityId: intent.agentId,
      field: 'currentRoom',
      oldValue: oldRoom,
      newValue: intent.target,
    }];
  }

  private applyAttack(intent: Intent, state: DungeonState): StateChange[] {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return [];

    const monster = state.monsters.find(
      m => m.roomId === run.currentRoom && m.hp > 0
    );
    if (!monster) return [];

    const damage = this.calculateDamage(run.adventurer);
    const oldHp = monster.hp;
    monster.hp = Math.max(0, monster.hp - damage);

    run.damageDealt += damage;

    return [{
      type: 'health',
      entityId: monster.id,
      field: 'hp',
      oldValue: oldHp,
      newValue: monster.hp,
    }];
  }

  private applyInteract(intent: Intent, state: DungeonState): StateChange[] {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return [];

    const room = state.rooms.find(r => r.id === run.currentRoom);
    if (room?.type !== 'treasure') return [];

    const goldFound = Math.floor(Math.random() * 50) + 10;
    const oldGold = run.goldCollected;
    run.goldCollected += goldFound;

    return [{
      type: 'resource',
      entityId: intent.agentId,
      field: 'goldCollected',
      oldValue: oldGold,
      newValue: run.goldCollected,
    }];
  }

  private applyDash(intent: Intent, state: DungeonState): StateChange[] {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return [];

    const oldStamina = run.adventurer.stamina;
    run.adventurer.stamina = Math.max(0, run.adventurer.stamina - 20);

    return [{
      type: 'resource',
      entityId: intent.agentId,
      field: 'stamina',
      oldValue: oldStamina,
      newValue: run.adventurer.stamina,
    }];
  }

  private calculateDamage(adventurer: any): number {
    const base = adventurer.policyBook.stats.STR * 2;
    const variance = Math.floor(Math.random() * 10) - 5;
    return Math.max(1, base + variance);
  }

  getDiffLog(): StateDiff[] {
    return [...this.diffLog];
  }

  clearLog(): void {
    this.diffLog = [];
    this.appliedIds.clear();
  }
}
