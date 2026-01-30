import { DungeonState, GovernanceParams, calculateScore } from '../core/gameState';
import { Jury } from '../governance/jury';
import { Judge } from '../governance/judge';
import { Executioner } from '../governance/executioner';
import { Intent } from '../governance/jury';

export interface LeaseToken {
  intentId: string;
  agentId: string;
  issuedAt: number;
  expiresAt: number;
  status: 'valid' | 'expired' | 'revoked';
}

export interface AckResponse {
  status: 'ack' | 'nack';
  lease?: LeaseToken;
  reasons?: string[];
  arbitrationConfig?: ArbitrationConfig;
}

export interface ArbitrationConfig {
  priorityWeights: Record<string, number>;
  tieBreak: 'earliest' | 'random' | 'priority';
  quotas: Record<string, number>;
}

export class Director {
  private jury: Jury;
  private judge: Judge;
  private executioner: Executioner;
  private leaseWindow: number = 100;
  private activeLeases: Map<string, LeaseToken> = new Map();
  private governanceParams: GovernanceParams;

  constructor(params: GovernanceParams) {
    this.jury = new Jury();
    this.judge = new Judge();
    this.executioner = new Executioner();
    this.governanceParams = params;
  }

  processIntent(intent: Intent, state: DungeonState): AckResponse {
    const juryResult = this.jury.validateIntent(intent, state);
    if (!juryResult.valid) {
      return {
        status: 'nack',
        reasons: juryResult.reasons,
      };
    }

    const judgeResult = this.judge.validateIntent(intent, state);
    if (!judgeResult.valid) {
      return {
        status: 'nack',
        reasons: judgeResult.reasons,
      };
    }

    const lease = this.issueLease(intent);
    this.judge.addPendingIntent(intent);

    return {
      status: 'ack',
      lease,
      arbitrationConfig: this.getArbitrationConfig(),
    };
  }

  private issueLease(intent: Intent): LeaseToken {
    const now = Date.now();
    const lease: LeaseToken = {
      intentId: intent.id,
      agentId: intent.agentId,
      issuedAt: now,
      expiresAt: now + this.leaseWindow,
      status: 'valid',
    };

    this.activeLeases.set(intent.id, lease);
    return lease;
  }

  commitTick(state: DungeonState): void {
    const validIntents = this.getValidLeasedIntents();
    const diff = this.executioner.executeIntents(validIntents, state);

    this.updateMetrics(state, diff.changes.length, validIntents);
    
    this.judge.clearPending();
    this.expireLeases();

    state.tick++;
  }

  private getValidLeasedIntents(): Intent[] {
    const pending = this.judge.getPendingIntents();
    const now = Date.now();

    return pending.filter(intent => {
      const lease = this.activeLeases.get(intent.id);
      return lease && lease.status === 'valid' && lease.expiresAt > now;
    });
  }

  private expireLeases(): void {
    const now = Date.now();
    for (const [id, lease] of this.activeLeases.entries()) {
      if (lease.expiresAt <= now) {
        lease.status = 'expired';
      }
    }
  }

  private updateMetrics(state: DungeonState, changesApplied: number, intents: Intent[]): void {
    state.metrics.progress += changesApplied * 0.5;

    const actionTypes = new Set(intents.map(i => i.action));
    state.metrics.diversity = this.calculateEntropy(actionTypes.size, intents.length);

    if (changesApplied === 0) {
      state.metrics.stalls++;
    }

    state.metrics.totalScore = calculateScore(state.metrics, this.governanceParams);
  }

  private calculateEntropy(uniqueActions: number, totalActions: number): number {
    if (totalActions === 0) return 0;
    
    const probability = uniqueActions / totalActions;
    return -probability * Math.log2(probability + 0.0001);
  }

  private getArbitrationConfig(): ArbitrationConfig {
    return {
      priorityWeights: {
        warrior: 1.2,
        mage: 1.0,
        rogue: 1.1,
        cleric: 0.9,
      },
      tieBreak: 'earliest',
      quotas: {},
    };
  }

  updateGovernanceParams(params: Partial<GovernanceParams>): void {
    this.governanceParams = { ...this.governanceParams, ...params };
  }

  getGovernanceParams(): GovernanceParams {
    return { ...this.governanceParams };
  }

  getDiffLog() {
    return this.executioner.getDiffLog();
  }
}
