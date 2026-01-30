import { useEffect, useState } from 'react'
import { Cpu, Gamepad2, Layers, Sparkles } from 'lucide-react'

interface Adventurer {
  id: string
  name: string
  class: 'warrior' | 'mage' | 'rogue' | 'cleric'
  x: number
  y: number
  hp: number
  maxHp: number
  status: 'idle' | 'moving' | 'fighting' | 'dead'
  behavior: 'solo' | 'team' | 'murder_hobo'
  currentRoom: string
}

export const MultiAgentLab = () => {
  const [adventurers, setAdventurers] = useState<Adventurer[]>([
    {
      id: 'warrior-1',
      name: 'Throk',
      class: 'warrior',
      x: 10,
      y: 50,
      hp: 100,
      maxHp: 100,
      status: 'moving',
      behavior: 'solo',
      currentRoom: 'entry',
    },
    {
      id: 'mage-1',
      name: 'Zara',
      class: 'mage',
      x: 10,
      y: 30,
      hp: 60,
      maxHp: 60,
      status: 'moving',
      behavior: 'team',
      currentRoom: 'entry',
    },
    {
      id: 'rogue-1',
      name: 'Vex',
      class: 'rogue',
      x: 10,
      y: 70,
      hp: 75,
      maxHp: 75,
      status: 'moving',
      behavior: 'murder_hobo',
      currentRoom: 'entry',
    },
  ])

  const [log, setLog] = useState<string[]>([
    '> System initialized',
    '> Adventurers spawned at entry',
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setAdventurers((prev) =>
        prev.map((adv) => {
          if (adv.status === 'dead') return adv

          const newX = Math.min(90, adv.x + Math.random() * 3)
          let newStatus: Adventurer['status'] = adv.status

          // Random events
          if (Math.random() < 0.05) {
            newStatus = 'fighting'
            const damage = Math.floor(Math.random() * 20) + 5
            const newHp = Math.max(0, adv.hp - damage)
            
            if (newHp === 0) {
              newStatus = 'dead'
              setLog((prev) => [
                ...prev.slice(-5),
                `> ${adv.name} (${adv.class}) has been defeated!`,
              ])
            } else {
              setLog((prev) => [
                ...prev.slice(-5),
                `> ${adv.name} took ${damage} damage from trap`,
              ])
            }

            return { ...adv, x: newX, hp: newHp, status: newStatus }
          }

          if (adv.status === 'fighting' && Math.random() < 0.3) {
            newStatus = 'moving'
          }

          // Murder hobo behavior
          if (adv.behavior === 'murder_hobo' && Math.random() < 0.02) {
            setLog((prev) => [
              ...prev.slice(-5),
              `> ${adv.name} attacks everything in sight!`,
            ])
          }

          // Team behavior
          if (adv.behavior === 'team' && Math.random() < 0.03) {
            setLog((prev) => [
              ...prev.slice(-5),
              `> ${adv.name} coordinates with team`,
            ])
          }

          return { ...adv, x: newX, status: newStatus }
        })
      )
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const classIcons = {
    warrior: <Gamepad2 size={16} className="text-white" />,
    mage: <Sparkles size={16} className="text-white" />,
    rogue: <Layers size={16} className="text-white" />,
    cleric: <Cpu size={16} className="text-white" />,
  }

  const behaviorColors = {
    solo: 'bg-blue-500',
    team: 'bg-green-500',
    murder_hobo: 'bg-red-500',
  }

  const statusColors = {
    idle: 'text-stone-400',
    moving: 'text-blue-400',
    fighting: 'text-red-400',
    dead: 'text-stone-600',
  }

  return (
    <div className="h-full flex flex-col min-h-[420px] bg-[#0f0f0f] p-4">

      <div className="flex-1 relative bg-stone-900 border-4 border-amber-500 overflow-hidden">
        {/* Dungeon path indicator */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-500/20" />

        {/* Adventurers */}
        {adventurers.map((adv) => (
          <div
            key={adv.id}
            className="absolute transition-all duration-300"
            style={{
              left: `${adv.x}%`,
              top: `${adv.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`w-8 h-8 ${behaviorColors[adv.behavior]} rounded-full border-2 border-white flex items-center justify-center ${adv.status === 'dead' ? 'opacity-30' : ''}`}>
              {classIcons[adv.class]}
            </div>
            <div className="text-center mt-1">
              <div className="text-[8px] font-mono text-white bg-black px-1 rounded">
                {adv.name}
              </div>
              <div className={`text-[7px] font-mono ${statusColors[adv.status]}`}>
                {adv.status.toUpperCase()}
              </div>
              {adv.status !== 'dead' && (
                <div className="w-12 h-1 bg-stone-700 rounded overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(adv.hp / adv.maxHp) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {adventurers.map((adv) => (
          <div
            key={adv.id}
            className="bg-stone-900 border border-stone-700 p-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">{adv.name}</span>
              <span className="text-[8px] text-stone-400">{adv.class.toUpperCase()}</span>
            </div>
            <div className="text-[9px] space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">HP:</span>
                <span className="text-green-400">{adv.hp}/{adv.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Type:</span>
                <span className="text-amber-400">{adv.behavior.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className={statusColors[adv.status]}>{adv.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-stone-900 border-t-2 border-amber-500 p-3 h-24 overflow-y-auto">
        <div className="font-mono text-[9px] text-green-500 space-y-1">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
