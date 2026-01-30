CREATE TABLE IF NOT EXISTS adventurers (
  id TEXT PRIMARY KEY,
  class TEXT NOT NULL CHECK(class IN ('warrior', 'mage', 'rogue', 'cleric')),
  level INTEGER NOT NULL DEFAULT 1,
  max_hp INTEGER NOT NULL,
  max_stamina INTEGER NOT NULL,
  traits TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS policy_books (
  adventurer_id TEXT PRIMARY KEY,
  str INTEGER NOT NULL,
  dex INTEGER NOT NULL,
  con INTEGER NOT NULL,
  int INTEGER NOT NULL,
  wis INTEGER NOT NULL,
  cha INTEGER NOT NULL,
  proficiencies TEXT NOT NULL,
  features TEXT NOT NULL,
  abilities TEXT NOT NULL,
  legal_moves TEXT NOT NULL,
  FOREIGN KEY (adventurer_id) REFERENCES adventurers(id)
);

CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  adventurer_id TEXT NOT NULL,
  start_tick INTEGER NOT NULL,
  end_tick INTEGER,
  status TEXT NOT NULL CHECK(status IN ('active', 'defeated', 'escaped', 'completed')),
  gold_collected INTEGER NOT NULL DEFAULT 0,
  damage_dealt INTEGER NOT NULL DEFAULT 0,
  damage_taken INTEGER NOT NULL DEFAULT 0,
  rooms_visited INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (adventurer_id) REFERENCES adventurers(id)
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('entry', 'corridor', 'treasure', 'boss', 'trap_room')),
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  trap_slots INTEGER NOT NULL DEFAULT 0,
  monster_capacity INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  connections TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS traps (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('spike', 'arrow', 'fire', 'poison', 'magic')),
  damage INTEGER NOT NULL,
  trigger_chance REAL NOT NULL CHECK(trigger_chance >= 0 AND trigger_chance <= 1),
  gold_cost INTEGER NOT NULL,
  mana_cost INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'triggered', 'disabled')),
  placed_at INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS monsters (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('goblin', 'skeleton', 'orc', 'drake', 'demon')),
  max_hp INTEGER NOT NULL,
  current_hp INTEGER NOT NULL,
  damage INTEGER NOT NULL,
  gold_cost INTEGER NOT NULL,
  behavior TEXT NOT NULL CHECK(behavior IN ('aggressive', 'defensive', 'patrol')),
  spawned_at INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS intents (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  tick INTEGER NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  args TEXT,
  rationale TEXT,
  jury_result TEXT NOT NULL,
  judge_result TEXT NOT NULL,
  executed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS state_diffs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tick INTEGER NOT NULL,
  intent_ids TEXT NOT NULL,
  changes TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS governance_metrics (
  tick INTEGER PRIMARY KEY,
  progress REAL NOT NULL DEFAULT 0,
  diversity REAL NOT NULL DEFAULT 0,
  violations INTEGER NOT NULL DEFAULT 0,
  stalls INTEGER NOT NULL DEFAULT 0,
  total_score REAL NOT NULL DEFAULT 0,
  entropy REAL NOT NULL DEFAULT 0,
  alpha REAL NOT NULL,
  beta REAL NOT NULL,
  gamma REAL NOT NULL,
  delta REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS run_features (
  run_id TEXT PRIMARY KEY,
  avg_hp_ratio REAL,
  avg_stamina_ratio REAL,
  trap_encounters INTEGER,
  monster_encounters INTEGER,
  damage_ratio REAL,
  exploration_ratio REAL,
  action_diversity REAL,
  success INTEGER NOT NULL,
  FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE INDEX IF NOT EXISTS idx_runs_adventurer ON runs(adventurer_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_traps_room ON traps(room_id);
CREATE INDEX IF NOT EXISTS idx_monsters_room ON monsters(room_id);
CREATE INDEX IF NOT EXISTS idx_intents_tick ON intents(tick);
CREATE INDEX IF NOT EXISTS idx_intents_agent ON intents(agent_id);
CREATE INDEX IF NOT EXISTS idx_state_diffs_tick ON state_diffs(tick);
