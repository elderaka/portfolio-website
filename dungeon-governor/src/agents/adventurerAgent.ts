import { Adventurer, PolicyBook, DungeonState } from '../core/gameState';
import { Intent } from '../governance/jury';

export interface AgentMemory {
  shortTerm: MemoryEntry[];
  longTerm: MemoryEntry[];
  maxShortTerm: number;
  maxLongTerm: number;
}

export interface MemoryEntry {
  id: string;
  text: string;
  importance: number;
  tick: number;
  lastAccessed: number;
  accessCount: number;
  tags: string[];
}

export class AdventurerAgent {
  public id: string;
  public adventurer: Adventurer;
  private memory: AgentMemory;
  private decisionHistory: Intent[] = [];

  constructor(adventurer: Adventurer) {
    this.id = adventurer.id;
    this.adventurer = adventurer;
    this.memory = {
      shortTerm: [],
      longTerm: [],
      maxShortTerm: 6,
      maxLongTerm: 20,
    };
  }

  proposeIntent(state: DungeonState, currentRoom: string): Intent {
    const legalMoves = this.getLegalMoves(state, currentRoom);
    
    if (legalMoves.length === 0) {
      return this.createIntent('Wait', state.tick);
    }

    const action = this.selectAction(legalMoves, state, currentRoom);
    return this.createIntent(action.name, state.tick, action.target, action.rationale);
  }

  private getLegalMoves(state: DungeonState, currentRoom: string): string[] {
    const baseMoves = this.adventurer.policyBook.legalMoves;
    const filtered: string[] = [];

    if (this.adventurer.stamina >= 10) {
      filtered.push(...baseMoves);
    } else {
      filtered.push(...baseMoves.filter(m => m !== 'Dash' && m !== 'Attack'));
    }

    if (this.adventurer.hp < this.adventurer.maxHp * 0.3) {
      return filtered.filter(m => m !== 'Attack');
    }

    return filtered;
  }

  private selectAction(
    legalMoves: string[],
    state: DungeonState,
    currentRoom: string
  ): { name: string; target?: string; rationale: string } {
    const room = state.rooms.find(r => r.id === currentRoom);
    if (!room) {
      return { name: 'Wait', rationale: 'Room not found' };
    }

    const monsters = state.monsters.filter(m => m.roomId === currentRoom && m.hp > 0);

    if (monsters.length > 0 && legalMoves.includes('Attack')) {
      if (this.shouldAttack(monsters[0])) {
        return {
          name: 'Attack',
          target: monsters[0].id,
          rationale: 'Engaging hostile entity',
        };
      }
    }

    if (room.type === 'treasure' && legalMoves.includes('Interact')) {
      return {
        name: 'Interact',
        rationale: 'Collecting resources',
      };
    }

    if (legalMoves.includes('Move') && room.connections.length > 0) {
      const target = this.selectNextRoom(room.connections, state);
      return {
        name: 'Move',
        target,
        rationale: 'Advancing through dungeon',
      };
    }

    return {
      name: legalMoves[0] || 'Wait',
      rationale: 'Default action',
    };
  }

  private shouldAttack(monster: any): boolean {
    const healthRatio = this.adventurer.hp / this.adventurer.maxHp;
    
    if (healthRatio < 0.4) return false;
    if (this.adventurer.stamina < 15) return false;

    const traits = this.adventurer.traits;
    if (traits.includes('Cautious') && healthRatio < 0.6) return false;
    if (traits.includes('Aggressive')) return true;

    return healthRatio > 0.5;
  }

  private selectNextRoom(connections: string[], state: DungeonState): string {
    const unvisited = connections.filter(roomId => {
      const history = this.decisionHistory.filter(
        d => d.action === 'Move' && d.target === roomId
      );
      return history.length === 0;
    });

    if (unvisited.length > 0) {
      return unvisited[Math.floor(Math.random() * unvisited.length)];
    }

    return connections[Math.floor(Math.random() * connections.length)];
  }

  private createIntent(
    action: string,
    tick: number,
    target?: string,
    rationale?: string
  ): Intent {
    const intent: Intent = {
      id: `${this.id}-${tick}-${Date.now()}`,
      agentId: this.id,
      tick,
      action,
      target,
      rationale,
    };

    this.decisionHistory.push(intent);
    return intent;
  }

  addMemory(text: string, importance: number, tick: number, tags: string[]): void {
    const entry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      text,
      importance,
      tick,
      lastAccessed: tick,
      accessCount: 0,
      tags,
    };

    this.memory.shortTerm.push(entry);

    if (this.memory.shortTerm.length > this.memory.maxShortTerm) {
      const promoted = this.memory.shortTerm.shift();
      if (promoted && promoted.importance >= 7) {
        this.memory.longTerm.push(promoted);
      }
    }

    if (this.memory.longTerm.length > this.memory.maxLongTerm) {
      this.memory.longTerm.sort((a, b) => a.importance - b.importance);
      this.memory.longTerm.shift();
    }
  }

  getMemory(): AgentMemory {
    return this.memory;
  }

  getDecisionHistory(): Intent[] {
    return [...this.decisionHistory];
  }
}
