export interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerCondition;
  action: AutomatedAction;
  enabled: boolean;
  priority: number;
}

export interface TriggerCondition {
  type: 'threshold' | 'event' | 'timer' | 'pattern';
  params: Record<string, any>;
}

export interface AutomatedAction {
  type: 'spawn' | 'upgrade' | 'repair' | 'adjust';
  target: string;
  params: Record<string, any>;
}

export class AutomationEngine {
  private rules: AutomationRule[] = [];
  private executionLog: AutomationLog[] = [];

  addRule(rule: AutomationRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  evaluateRules(state: any): AutomatedAction[] {
    const triggered: AutomatedAction[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      if (this.checkTrigger(rule.trigger, state)) {
        triggered.push(rule.action);
        this.logExecution(rule, state);
      }
    }

    return triggered;
  }

  private checkTrigger(trigger: TriggerCondition, state: any): boolean {
    switch (trigger.type) {
      case 'threshold':
        return this.checkThreshold(trigger.params, state);
      case 'event':
        return this.checkEvent(trigger.params, state);
      case 'timer':
        return this.checkTimer(trigger.params, state);
      case 'pattern':
        return this.checkPattern(trigger.params, state);
      default:
        return false;
    }
  }

  private checkThreshold(params: any, state: any): boolean {
    const { metric, operator, value } = params;
    const current = state.metrics?.[metric] || 0;

    switch (operator) {
      case 'gt': return current > value;
      case 'lt': return current < value;
      case 'eq': return current === value;
      case 'gte': return current >= value;
      case 'lte': return current <= value;
      default: return false;
    }
  }

  private checkEvent(params: any, state: any): boolean {
    return state.lastEvent === params.eventType;
  }

  private checkTimer(params: any, state: any): boolean {
    return state.tick % params.interval === 0;
  }

  private checkPattern(params: any, state: any): boolean {
    return false;
  }

  private logExecution(rule: AutomationRule, state: any): void {
    this.executionLog.push({
      ruleId: rule.id,
      ruleName: rule.name,
      tick: state.tick,
      timestamp: Date.now(),
    });
  }

  getExecutionLog(): AutomationLog[] {
    return [...this.executionLog];
  }

  clearLog(): void {
    this.executionLog = [];
  }
}

export interface AutomationLog {
  ruleId: string;
  ruleName: string;
  tick: number;
  timestamp: number;
}

export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto-spawn-1',
    name: 'Spawn monster when room empty',
    trigger: {
      type: 'threshold',
      params: { metric: 'monstersInRoom', operator: 'eq', value: 0 },
    },
    action: {
      type: 'spawn',
      target: 'monster',
      params: { type: 'goblin', roomType: 'corridor' },
    },
    enabled: true,
    priority: 5,
  },
  {
    id: 'auto-repair-1',
    name: 'Repair traps after trigger',
    trigger: {
      type: 'event',
      params: { eventType: 'trap_triggered' },
    },
    action: {
      type: 'repair',
      target: 'trap',
      params: { cost: 10 },
    },
    enabled: true,
    priority: 3,
  },
  {
    id: 'auto-adjust-1',
    name: 'Balance difficulty every 10 ticks',
    trigger: {
      type: 'timer',
      params: { interval: 10 },
    },
    action: {
      type: 'adjust',
      target: 'difficulty',
      params: { factor: 1.1 },
    },
    enabled: true,
    priority: 2,
  },
];
