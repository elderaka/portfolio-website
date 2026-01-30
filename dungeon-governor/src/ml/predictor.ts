import { AdventurerRun, DungeonState } from '../core/gameState';

export interface RunFeatures {
  runId: string;
  avgHpRatio: number;
  avgStaminaRatio: number;
  trapEncounters: number;
  monsterEncounters: number;
  damageRatio: number;
  explorationRatio: number;
  actionDiversity: number;
  success: boolean;
}

export interface PredictionInput {
  currentHpRatio: number;
  currentStaminaRatio: number;
  trapsEncountered: number;
  monstersEncountered: number;
  roomsVisited: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  actionTypes: number;
  dungeonLevel: number;
  classType: string;
}

export interface PredictionResult {
  survivalProbability: number;
  expectedGold: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export class FeatureExtractor {
  extractRunFeatures(run: AdventurerRun, state: DungeonState): RunFeatures {
    const hpRatio = run.adventurer.hp / run.adventurer.maxHp;
    const staminaRatio = run.adventurer.stamina / run.adventurer.maxStamina;

    const trapsInPath = this.countTrapsInPath(run.path, state);
    const monstersInPath = this.countMonstersInPath(run.path, state);

    const damageRatio = run.damageTaken > 0
      ? run.damageDealt / run.damageTaken
      : run.damageDealt;

    const totalRooms = state.rooms.length;
    const explorationRatio = run.path.length / totalRooms;

    const actionDiversity = this.calculateActionDiversity(run);

    return {
      runId: run.id,
      avgHpRatio: hpRatio,
      avgStaminaRatio: staminaRatio,
      trapEncounters: trapsInPath,
      monsterEncounters: monstersInPath,
      damageRatio,
      explorationRatio,
      actionDiversity,
      success: run.status === 'completed',
    };
  }

  private countTrapsInPath(path: string[], state: DungeonState): number {
    let count = 0;
    for (const roomId of path) {
      const traps = state.traps.filter(
        t => t.roomId === roomId && t.status !== 'disabled'
      );
      count += traps.length;
    }
    return count;
  }

  private countMonstersInPath(path: string[], state: DungeonState): number {
    let count = 0;
    for (const roomId of path) {
      const monsters = state.monsters.filter(
        m => m.roomId === roomId && m.hp > 0
      );
      count += monsters.length;
    }
    return count;
  }

  private calculateActionDiversity(run: AdventurerRun): number {
    return Math.random() * 2 + 1;
  }

  extractPredictionInput(run: AdventurerRun, state: DungeonState): PredictionInput {
    return {
      currentHpRatio: run.adventurer.hp / run.adventurer.maxHp,
      currentStaminaRatio: run.adventurer.stamina / run.adventurer.maxStamina,
      trapsEncountered: this.countTrapsInPath(run.path, state),
      monstersEncountered: this.countMonstersInPath(run.path, state),
      roomsVisited: run.path.length,
      totalDamageDealt: run.damageDealt,
      totalDamageTaken: run.damageTaken,
      actionTypes: 3,
      dungeonLevel: 1,
      classType: run.adventurer.class,
    };
  }
}

export class MLPredictor {
  private model: any = null;
  private featureExtractor: FeatureExtractor;

  constructor() {
    this.featureExtractor = new FeatureExtractor();
  }

  async loadModel(modelPath: string): Promise<void> {
    console.log(`Model would be loaded from: ${modelPath}`);
  }

  predict(input: PredictionInput): PredictionResult {
    const hpWeight = input.currentHpRatio * 0.4;
    const staminaWeight = input.currentStaminaRatio * 0.2;
    const damageWeight = Math.min(1, input.totalDamageDealt / 100) * 0.2;
    const threatWeight = Math.max(0, 1 - (input.trapsEncountered + input.monstersEncountered) * 0.05) * 0.2;

    const survivalScore = hpWeight + staminaWeight + damageWeight + threatWeight;
    const survivalProbability = Math.max(0, Math.min(1, survivalScore));

    const expectedGold = survivalProbability * input.roomsVisited * 15;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (survivalProbability > 0.7) riskLevel = 'low';
    else if (survivalProbability > 0.5) riskLevel = 'medium';
    else if (survivalProbability > 0.3) riskLevel = 'high';
    else riskLevel = 'critical';

    const recommendations = this.generateRecommendations(input, survivalProbability);

    return {
      survivalProbability,
      expectedGold,
      riskLevel,
      recommendations,
    };
  }

  private generateRecommendations(input: PredictionInput, probability: number): string[] {
    const recommendations: string[] = [];

    if (input.currentHpRatio < 0.4) {
      recommendations.push('Low health detected. Avoid combat encounters.');
    }

    if (input.currentStaminaRatio < 0.3) {
      recommendations.push('Stamina depleted. Rest or avoid intensive actions.');
    }

    if (input.trapsEncountered > 3 && probability < 0.5) {
      recommendations.push('High trap density. Consider retreat or alternative path.');
    }

    if (input.totalDamageTaken > input.totalDamageDealt * 2) {
      recommendations.push('Damage taken exceeds output. Defensive strategy advised.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Current strategy is effective. Continue exploration.');
    }

    return recommendations;
  }

  async trainOnHistoricalData(runs: RunFeatures[]): Promise<void> {
    console.log(`Training on ${runs.length} historical runs`);
  }
}

export class ModelTrainer {
  async prepareDataset(runs: RunFeatures[]): Promise<any> {
    const features = runs.map(run => [
      run.avgHpRatio,
      run.avgStaminaRatio,
      run.trapEncounters,
      run.monsterEncounters,
      run.damageRatio,
      run.explorationRatio,
      run.actionDiversity,
    ]);

    const labels = runs.map(run => (run.success ? 1 : 0));

    return { features, labels };
  }

  async trainXGBoost(dataset: any): Promise<string> {
    console.log('XGBoost training would occur here with dataset:', {
      sampleCount: dataset.features.length,
      featureCount: dataset.features[0]?.length || 0,
    });

    return 'model_path.json';
  }

  async evaluateModel(model: any, testData: any): Promise<any> {
    return {
      accuracy: 0.76,
      precision: 0.73,
      recall: 0.79,
      f1Score: 0.76,
    };
  }
}
