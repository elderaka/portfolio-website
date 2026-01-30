# Dungeon Governor

Administrative control system for automated dungeon management with multi-agent coordination and predictive analytics.

## Architecture

### Core Systems

**Governance Layer** - Role-gated control loop implementing validation gates:
- Jury: Schema and internal consistency validation
- Judge: Rule enforcement and conflict resolution  
- Executioner: Atomic state application with diff logging

**Multi-Agent Coordination** - Adventurer agents with policy-driven decision making:
- Intent-based action proposal system
- Lease-based handshake protocol for race-free coordination
- Memory system with short-term and long-term stores

**Machine Learning** - XGBoost-based survival prediction:
- Feature extraction from run history
- Real-time risk assessment
- Actionable recommendations

**Automation** - Rule-based dungeon management:
- Threshold, event, timer, and pattern triggers
- Automated spawn, repair, and difficulty adjustment
- Priority-based execution

### Project Structure

```
dungeon-governor/
├── src/
│   ├── core/
│   │   └── gameState.ts          # State definitions and scoring
│   ├── governance/
│   │   ├── jury.ts                # Internal validation gate
│   │   ├── judge.ts               # External validation gate
│   │   └── executioner.ts         # State mutation and diff logging
│   ├── agents/
│   │   ├── adventurerAgent.ts     # Agent decision logic
│   │   └── director.ts            # Central coordinator
│   ├── database/
│   │   ├── schema.sql             # SQLite schema
│   │   └── database.ts            # Database interface
│   ├── ml/
│   │   └── predictor.ts           # Feature extraction and prediction
│   └── automation/
│       └── automationEngine.ts    # Rule evaluation and execution
└── dashboard/
    ├── index.html                 # Admin interface
    ├── styles.css                 # Dashboard styling
    └── dashboard.js               # Live metrics and controls
```

## Governance Framework

Based on research in language-conditioned control loops for multi-agent systems. Each agent proposes intents that traverse three validation gates before execution:

1. **Jury** validates schema, persona consistency, and legal move masks
2. **Judge** checks rules, budgets, capabilities, and conflicts
3. **Executioner** applies conflict-free intent sets atomically

All state changes are logged with structured diffs for auditability.

## Metrics and Scoring

System performance tracked through gamified metrics:

```
Score = α·progress + β·diversity - γ·violations - δ·stalls
```

Parameters (α, β, γ, δ) adjustable through dashboard for real-time behavior shaping.

## Database Schema

SQLite database tracks:
- Adventurer configurations and policy books
- Run history with outcomes
- Intent processing logs with validation results
- State diffs with timestamp and attribution
- Governance metrics over time
- Feature vectors for ML training

## Machine Learning Pipeline

1. Extract features from completed runs
2. Train XGBoost classifier on survival outcomes
3. Generate real-time predictions for active runs
4. Provide risk assessment and recommendations

Features include health ratios, encounter counts, damage metrics, exploration patterns, and action diversity.

## Automation System

Rule-based automation with configurable triggers:
- Threshold-based (metric crosses value)
- Event-driven (specific game events)
- Timer-based (periodic execution)
- Pattern-based (complex conditions)

Actions include entity spawning, trap repair, and difficulty adjustment.

## Setup

```bash
npm install
npm run build
npm start
```

Access dashboard at `http://localhost:3000/dashboard`

## Configuration

Governance parameters editable through dashboard or config file:
- Progress weight (α): Rewards forward movement
- Diversity weight (β): Encourages varied strategies
- Violation penalty (γ): Discourages rule breaks
- Stall penalty (δ): Penalizes inaction

## Research Foundation

Implementation inspired by work on jury-judge-executioner governance patterns for LLM-based multi-agent systems, adapted for game simulation without requiring language models.
