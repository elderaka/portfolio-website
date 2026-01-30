import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { DungeonState, Adventurer, AdventurerRun } from '../core/gameState';
import { Intent } from '../governance/jury';
import { StateDiff } from '../governance/executioner';

export class GameDatabase {
  private db: Database | null = null;

  async initialize(path: string): Promise<void> {
    this.db = await open({
      filename: path,
      driver: sqlite3.Database,
    });

    const schema = await this.readSchemaFile();
    await this.db.exec(schema);
  }

  private async readSchemaFile(): Promise<string> {
    const fs = await import('fs/promises');
    return await fs.readFile(
      './src/database/schema.sql',
      'utf-8'
    );
  }

  async saveAdventurer(adventurer: Adventurer): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO adventurers (id, class, level, max_hp, max_stamina, traits, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adventurer.id,
        adventurer.class,
        adventurer.level,
        adventurer.maxHp,
        adventurer.maxStamina,
        JSON.stringify(adventurer.traits),
        Date.now(),
      ]
    );

    await this.db.run(
      `INSERT INTO policy_books (
        adventurer_id, str, dex, con, int, wis, cha,
        proficiencies, features, abilities, legal_moves
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adventurer.id,
        adventurer.policyBook.stats.STR,
        adventurer.policyBook.stats.DEX,
        adventurer.policyBook.stats.CON,
        adventurer.policyBook.stats.INT,
        adventurer.policyBook.stats.WIS,
        adventurer.policyBook.stats.CHA,
        JSON.stringify(adventurer.policyBook.proficiencies),
        JSON.stringify(adventurer.policyBook.features),
        JSON.stringify(adventurer.abilities),
        JSON.stringify(adventurer.policyBook.legalMoves),
      ]
    );
  }

  async saveRun(run: AdventurerRun): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO runs (
        id, adventurer_id, start_tick, end_tick, status,
        gold_collected, damage_dealt, damage_taken, rooms_visited, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        run.id,
        run.adventurer.id,
        run.startTick,
        null,
        run.status,
        run.goldCollected,
        run.damageDealt,
        run.damageTaken,
        run.path.length,
        Date.now(),
      ]
    );
  }

  async updateRun(run: AdventurerRun, endTick: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `UPDATE runs SET
        end_tick = ?,
        status = ?,
        gold_collected = ?,
        damage_dealt = ?,
        damage_taken = ?,
        rooms_visited = ?
       WHERE id = ?`,
      [
        endTick,
        run.status,
        run.goldCollected,
        run.damageDealt,
        run.damageTaken,
        run.path.length,
        run.id,
      ]
    );
  }

  async saveIntent(intent: Intent, juryResult: string, judgeResult: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO intents (
        id, agent_id, tick, action, target, args,
        rationale, jury_result, judge_result, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        intent.id,
        intent.agentId,
        intent.tick,
        intent.action,
        intent.target || null,
        intent.args ? JSON.stringify(intent.args) : null,
        intent.rationale || null,
        juryResult,
        judgeResult,
        Date.now(),
      ]
    );
  }

  async saveStateDiff(diff: StateDiff): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO state_diffs (tick, intent_ids, changes, timestamp)
       VALUES (?, ?, ?, ?)`,
      [
        diff.tick,
        JSON.stringify(diff.intentsApplied),
        JSON.stringify(diff.changes),
        diff.timestamp,
      ]
    );
  }

  async saveMetrics(state: DungeonState): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO governance_metrics (
        tick, progress, diversity, violations, stalls,
        total_score, entropy, alpha, beta, gamma, delta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        state.tick,
        state.metrics.progress,
        state.metrics.diversity,
        state.metrics.violations,
        state.metrics.stalls,
        state.metrics.totalScore,
        state.metrics.entropy,
        1.0, 0.5, 0.8, 0.3, // Default params
      ]
    );
  }

  async getRunHistory(limit: number = 100): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM runs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
  }

  async getIntentsByTick(tick: number): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM intents WHERE tick = ? ORDER BY created_at`,
      [tick]
    );
  }

  async getMetricsHistory(limit: number = 100): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM governance_metrics ORDER BY tick DESC LIMIT ?`,
      [limit]
    );
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
    }
  }
}
