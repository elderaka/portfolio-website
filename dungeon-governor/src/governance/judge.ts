import { DungeonState, Room, Trap, Monster } from '../core/gameState';
import { Intent, ValidationResult } from './jury';

export class Judge {
  private pendingIntents: Intent[] = [];

  validateIntent(intent: Intent, state: DungeonState): ValidationResult {
    const reasons: string[] = [];

    if (!this.validateRules(intent, state)) {
      reasons.push('Violates game rules');
    }

    if (!this.validateBudgets(intent, state)) {
      reasons.push('Insufficient resources');
    }

    if (!this.validateConflicts(intent, state)) {
      reasons.push('Conflicts with pending intents');
    }

    if (!this.validateCapabilities(intent, state)) {
      reasons.push('Agent lacks required capabilities');
    }

    return {
      valid: reasons.length === 0,
      reasons,
      stage: 'judge',
    };
  }

  private validateRules(intent: Intent, state: DungeonState): boolean {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return false;

    switch (intent.action) {
      case 'Move':
        return this.validateMovement(intent, run.currentRoom, state);
      case 'Attack':
        return this.validateAttack(intent, run.currentRoom, state);
      case 'Interact':
        return this.validateInteraction(intent, run.currentRoom, state);
      default:
        return true;
    }
  }

  private validateMovement(intent: Intent, currentRoom: string, state: DungeonState): boolean {
    const room = state.rooms.find(r => r.id === currentRoom);
    if (!room) return false;

    return room.connections.includes(intent.target || '');
  }

  private validateAttack(intent: Intent, currentRoom: string, state: DungeonState): boolean {
    const monsters = state.monsters.filter(m => m.roomId === currentRoom && m.hp > 0);
    return monsters.length > 0;
  }

  private validateInteraction(intent: Intent, currentRoom: string, state: DungeonState): boolean {
    const room = state.rooms.find(r => r.id === currentRoom);
    return room?.type === 'treasure' || room?.type === 'entry';
  }

  private validateBudgets(intent: Intent, state: DungeonState): boolean {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return false;

    const budgets = run.adventurer.policyBook.budgets;

    if (intent.action === 'Attack' && budgets.action < 1) {
      return false;
    }

    if (intent.action === 'Dash' && budgets.bonus < 1) {
      return false;
    }

    if (intent.action === 'Move' && budgets.movement < 5) {
      return false;
    }

    return true;
  }

  private validateConflicts(intent: Intent, state: DungeonState): boolean {
    const conflicting = this.pendingIntents.find(pending => {
      if (pending.agentId === intent.agentId) return true;
      
      if (intent.action === 'Move' && pending.action === 'Move') {
        return intent.target === pending.target;
      }

      return false;
    });

    return !conflicting;
  }

  private validateCapabilities(intent: Intent, state: DungeonState): boolean {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return false;

    const abilities = run.adventurer.abilities;

    if (intent.action === 'Dash' && !abilities.includes('Dash')) {
      return false;
    }

    if (intent.action === 'Stealth' && !abilities.includes('Hide')) {
      return false;
    }

    return true;
  }

  addPendingIntent(intent: Intent): void {
    this.pendingIntents.push(intent);
  }

  clearPending(): void {
    this.pendingIntents = [];
  }

  getPendingIntents(): Intent[] {
    return [...this.pendingIntents];
  }
}
