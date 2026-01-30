import { DungeonState, Adventurer, Room, Trap, Monster } from '../core/gameState';

export interface Intent {
  id: string;
  agentId: string;
  tick: number;
  action: string;
  target?: string;
  args?: Record<string, any>;
  rationale?: string;
}

export interface ValidationResult {
  valid: boolean;
  reasons: string[];
  stage: 'jury' | 'judge' | 'executioner';
}

export class Jury {
  validateIntent(intent: Intent, state: DungeonState): ValidationResult {
    const reasons: string[] = [];

    if (!this.validateSchema(intent)) {
      reasons.push('Invalid intent schema');
    }

    if (!this.validateAgentExists(intent.agentId, state)) {
      reasons.push('Agent does not exist');
    }

    if (!this.validateActionInMask(intent, state)) {
      reasons.push('Action not in legal moves mask');
    }

    if (!this.validateContextConsistency(intent, state)) {
      reasons.push('Intent inconsistent with agent state');
    }

    return {
      valid: reasons.length === 0,
      reasons,
      stage: 'jury',
    };
  }

  private validateSchema(intent: Intent): boolean {
    return !!(
      intent.id &&
      intent.agentId &&
      typeof intent.tick === 'number' &&
      intent.action
    );
  }

  private validateAgentExists(agentId: string, state: DungeonState): boolean {
    return state.activeRuns.some(run => run.adventurer.id === agentId);
  }

  private validateActionInMask(intent: Intent, state: DungeonState): boolean {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return false;

    const legalMoves = this.getLegalMoves(run.adventurer, state);
    return legalMoves.includes(intent.action);
  }

  private getLegalMoves(adventurer: Adventurer, state: DungeonState): string[] {
    const baseMoves = adventurer.policyBook.legalMoves;
    
    if (adventurer.stamina < 10) {
      return baseMoves.filter(m => m !== 'Dash' && m !== 'Attack');
    }

    if (adventurer.hp < adventurer.maxHp * 0.3) {
      return baseMoves.filter(m => m !== 'Attack');
    }

    return baseMoves;
  }

  private validateContextConsistency(intent: Intent, state: DungeonState): boolean {
    const run = state.activeRuns.find(r => r.adventurer.id === intent.agentId);
    if (!run) return false;

    if (intent.action === 'Move' && !intent.target) {
      return false;
    }

    if (intent.action === 'Attack' && run.adventurer.stamina < 15) {
      return false;
    }

    return true;
  }
}
