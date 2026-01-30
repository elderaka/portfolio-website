import { useEffect, useRef, useState } from 'react'
import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

export const SQLiteLab = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbRef = useRef<any>(null)
  const [sqlReady, setSqlReady] = useState(false)
  const [sqlQuery, setSqlQuery] = useState(
    `-- Query dungeon data
SELECT 
  adventurer_name,
  class,
  hp,
  gold_collected,
  status
FROM adventurer_runs
WHERE status = 'active'
ORDER BY gold_collected DESC;`
  )
  const [sqlResult, setSqlResult] = useState<string>('')
  const [sqlError, setSqlError] = useState<string>('')

  useEffect(() => {
    let mounted = true
    initSqlJs({ locateFile: () => wasmUrl })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((SQL: any) => {
        if (!mounted) return
        const db = new SQL.Database()
        
        // Create dungeon tables
        db.run(`CREATE TABLE adventurer_runs (
          id INTEGER PRIMARY KEY,
          adventurer_name TEXT,
          class TEXT,
          hp INTEGER,
          max_hp INTEGER,
          gold_collected INTEGER,
          damage_dealt INTEGER,
          damage_taken INTEGER,
          traps_encountered INTEGER,
          rooms_visited INTEGER,
          status TEXT
        );`)

        db.run(`CREATE TABLE dungeon_rooms (
          id TEXT PRIMARY KEY,
          type TEXT,
          has_monster INTEGER,
          has_trap INTEGER,
          gold_available INTEGER
        );`)

        db.run(`CREATE TABLE monsters (
          id TEXT PRIMARY KEY,
          type TEXT,
          hp INTEGER,
          damage INTEGER,
          room_id TEXT,
          status TEXT
        );`)

        // Insert sample data
        db.run(`INSERT INTO adventurer_runs VALUES
          (1, 'Throk', 'warrior', 100, 100, 145, 320, 85, 2, 5, 'active'),
          (2, 'Zara', 'mage', 45, 60, 85, 180, 120, 4, 4, 'active'),
          (3, 'Vex', 'rogue', 75, 75, 230, 280, 45, 1, 6, 'active'),
          (4, 'Grom', 'warrior', 0, 120, 60, 140, 180, 5, 3, 'defeated'),
          (5, 'Luna', 'cleric', 50, 80, 120, 90, 60, 2, 5, 'active');`)

        db.run(`INSERT INTO dungeon_rooms VALUES
          ('entry', 'entry', 0, 0, 0),
          ('corridor1', 'corridor', 1, 1, 50),
          ('corridor2', 'corridor', 1, 0, 30),
          ('treasure', 'treasure', 0, 1, 200),
          ('boss', 'boss', 1, 1, 500);`)

        db.run(`INSERT INTO monsters VALUES
          ('goblin-1', 'goblin', 30, 10, 'corridor1', 'alive'),
          ('skeleton-1', 'skeleton', 40, 15, 'corridor2', 'dead'),
          ('drake-1', 'drake', 150, 30, 'boss', 'alive');`)

        dbRef.current = db
        setSqlReady(true)
      })
      .catch(() => {
        setSqlError('SQLite engine failed to load.')
      })

    return () => {
      mounted = false
    }
  }, [])

  const runSql = () => {
    if (!dbRef.current) return
    try {
      setSqlError('')
      const results = dbRef.current.exec(sqlQuery)
      if (!results.length) {
        setSqlResult('Query executed. No rows returned.')
        return
      }
      const [table] = results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = table.values.map((row: any[]) =>
        Object.fromEntries(table.columns.map((col: string, idx: number) => [col, row[idx]]))
      )
      setSqlResult(JSON.stringify(rows, null, 2))
    } catch {
      setSqlError('Query failed. Check your SQL syntax.')
    }
  }

  const quickQueries = [
    {
      label: 'Active Adventurers',
      query: `SELECT adventurer_name, class, hp, gold_collected FROM adventurer_runs WHERE status = 'active';`,
    },
    {
      label: 'Dungeon Stats',
      query: `SELECT type, COUNT(*) as count, SUM(has_monster) as monsters, SUM(has_trap) as traps FROM dungeon_rooms GROUP BY type;`,
    },
    {
      label: 'Top Performers',
      query: `SELECT adventurer_name, damage_dealt, gold_collected FROM adventurer_runs ORDER BY gold_collected DESC LIMIT 3;`,
    },
  ]

  return (
    <div className="h-full flex flex-col min-h-[420px] bg-[#0f0f0f] p-4">

      <div className="flex gap-2 mb-3">
        {quickQueries.map((q) => (
          <button
            key={q.label}
            onClick={() => setSqlQuery(q.query)}
            className="px-3 py-1 bg-stone-800 text-stone-400 border border-stone-700 font-mono text-[9px] uppercase hover:bg-stone-700 hover:text-white transition-all"
          >
            {q.label}
          </button>
        ))}
      </div>

      <textarea
        className="flex-1 font-mono text-[11px] p-3 bg-black text-green-500 outline-none resize-none border-2 border-amber-500 min-h-[150px]"
        value={sqlQuery}
        onChange={(e) => setSqlQuery(e.target.value)}
        spellCheck={false}
      />

      <div className="flex gap-3 mt-3 items-center">
        <button
          onClick={runSql}
          disabled={!sqlReady}
          className="bg-amber-500 text-black px-6 py-2 font-mono text-[10px] uppercase font-bold hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Execute Query
        </button>
        {sqlError && (
          <span className="font-mono text-[10px] text-red-500">{sqlError}</span>
        )}
      </div>

      <div className="mt-3 flex-1 border-2 border-amber-500 bg-black p-3 font-mono text-[10px] text-green-500 overflow-auto min-h-[120px]">
        {sqlResult ? (
          <pre className="whitespace-pre-wrap">{sqlResult}</pre>
        ) : (
          <div className="text-stone-600">Result output will appear here...</div>
        )}
      </div>

      <div className="mt-3 bg-stone-900 border-t-2 border-amber-500 p-3">
        <p className="font-mono text-[9px] text-stone-400">
          Tables: adventurer_runs, dungeon_rooms, monsters | All data persists in browser memory
        </p>
      </div>
    </div>
  )
}
