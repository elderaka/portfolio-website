import { useState, useEffect } from 'react'

interface AutomationRule {
  id: string
  name: string
  trigger: string
  action: string
  enabled: boolean
  lastTriggered: number | null
}

export const AutomationLab = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-1',
      name: 'Auto Spawn Monsters',
      trigger: 'Room has 0 monsters',
      action: 'Spawn goblin in corridor',
      enabled: true,
      lastTriggered: null,
    },
    {
      id: 'rule-2',
      name: 'Repair Traps',
      trigger: 'Trap triggered',
      action: 'Reset trap (10 mana)',
      enabled: true,
      lastTriggered: null,
    },
    {
      id: 'rule-3',
      name: 'Difficulty Scaling',
      trigger: 'Every 10 ticks',
      action: 'Increase monster stats by 10%',
      enabled: false,
      lastTriggered: null,
    },
    {
      id: 'rule-4',
      name: 'Gold Collection',
      trigger: 'Adventurer defeated',
      action: 'Add gold to treasury',
      enabled: true,
      lastTriggered: null,
    },
  ])

  const [log, setLog] = useState<string[]>([
    '> Automation engine initialized',
    '> 3 active rules loaded',
  ])

  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setRules((prev) =>
        prev.map((rule) => {
          if (!rule.enabled) return rule

          if (Math.random() < 0.15) {
            const now = Date.now()
            setLog((prevLog) => [
              ...prevLog.slice(-6),
              `> [${new Date(now).toLocaleTimeString()}] ${rule.name}: ${rule.action}`,
            ])
            return { ...rule, lastTriggered: now }
          }
          return rule
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    )
  }

  return (
    <div className="h-full flex flex-col min-h-[420px] bg-[#0f0f0f] p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-amber-500">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-white">
            Active Rules: {rules.filter((r) => r.enabled).length} / {rules.length}
          </div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 font-mono text-[10px] uppercase font-bold transition-all ${
              isRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-black hover:bg-green-600'
            }`}
          >
            {isRunning ? '■ Stop Engine' : '▶ Start Engine'}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto mb-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-stone-900 border-2 p-4 transition-all ${
              rule.enabled ? 'border-amber-500' : 'border-stone-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-10 h-6 rounded-full relative transition-all ${
                    rule.enabled ? 'bg-green-500' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      rule.enabled ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
                <div>
                  <div className="text-white font-mono font-bold text-sm">{rule.name}</div>
                  <div className="text-stone-500 font-mono text-[9px] uppercase">
                    ID: {rule.id}
                  </div>
                </div>
              </div>
              {rule.lastTriggered && (
                <div className="text-green-500 font-mono text-[9px]">
                  Last: {new Date(rule.lastTriggered).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black p-2 border border-stone-800">
                <div className="text-stone-500 font-mono text-[8px] uppercase mb-1">
                  Trigger
                </div>
                <div className="text-amber-400 font-mono text-[10px]">{rule.trigger}</div>
              </div>
              <div className="bg-black p-2 border border-stone-800">
                <div className="text-stone-500 font-mono text-[8px] uppercase mb-1">
                  Action
                </div>
                <div className="text-blue-400 font-mono text-[10px]">{rule.action}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-stone-900 border-2 border-amber-500 p-3 h-32 overflow-y-auto">
        <div className="font-mono text-[9px] text-green-500 space-y-1">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-stone-900 border-t-2 border-amber-500 p-3">
        <p className="font-mono text-[9px] text-stone-400">
          Dungeon Master automation: spawn monsters, repair traps, scale difficulty, collect gold from defeats
        </p>
      </div>
    </div>
  )
}
