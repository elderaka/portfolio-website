import { useEffect, useRef, useState } from 'react'

interface Room {
  id: string
  x: number
  y: number
  type: 'entry' | 'corridor' | 'treasure' | 'boss'
  hasMonster: boolean
  hasTrap: boolean
}

interface Resources {
  gold: number
  mana: number
}

export const GamedevLab = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resources, setResources] = useState<Resources>({ gold: 200, mana: 100 })
  const [selectedTool, setSelectedTool] = useState<'trap' | 'monster' | null>(null)
  const [rooms] = useState<Room[]>([
    { id: 'entry', x: 50, y: 200, type: 'entry', hasMonster: false, hasTrap: false },
    { id: 'corridor1', x: 150, y: 200, type: 'corridor', hasMonster: false, hasTrap: false },
    { id: 'corridor2', x: 250, y: 200, type: 'corridor', hasMonster: false, hasTrap: false },
    { id: 'treasure', x: 350, y: 150, type: 'treasure', hasMonster: false, hasTrap: false },
    { id: 'boss', x: 450, y: 200, type: 'boss', hasMonster: false, hasTrap: false },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      // Background
      ctx.fillStyle = '#0f0f0f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid (subtle)
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw connections
      ctx.strokeStyle = '#444'
      ctx.lineWidth = 2
      for (let i = 0; i < rooms.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(rooms[i].x + 20, rooms[i].y + 20)
        ctx.lineTo(rooms[i + 1].x + 20, rooms[i + 1].y + 20)
        ctx.stroke()
      }

      // Draw rooms
      rooms.forEach((room) => {
        // Room color based on type
        const colors = {
          entry: '#56d364',
          corridor: '#58a6ff',
          treasure: '#d29922',
          boss: '#f85149',
        }
        ctx.fillStyle = colors[room.type]
        ctx.fillRect(room.x, room.y, 40, 40)

        // Room border
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeRect(room.x, room.y, 40, 40)

        // Icons
        ctx.fillStyle = '#fff'
        ctx.font = '12px monospace'
        if (room.hasTrap) {
          ctx.fillText('⚠', room.x + 5, room.y + 15)
        }
        if (room.hasMonster) {
          ctx.fillText('👹', room.x + 5, room.y + 35)
        }

        // Label
        ctx.fillStyle = '#aaa'
        ctx.font = '8px monospace'
        ctx.fillText(room.type.toUpperCase(), room.x, room.y - 5)
      })

      // Selection indicator
      if (selectedTool) {
        ctx.fillStyle = selectedTool === 'trap' ? '#d29922' : '#f85149'
        ctx.font = '10px monospace'
        ctx.fillText(`PLACING: ${selectedTool.toUpperCase()}`, 10, 20)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (!selectedTool) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const clickedRoom = rooms.find(
        (r) => x >= r.x && x <= r.x + 40 && y >= r.y && y <= r.y + 40
      )

      if (clickedRoom) {
        if (selectedTool === 'trap' && resources.mana >= 10) {
          clickedRoom.hasTrap = true
          setResources((prev) => ({ ...prev, mana: prev.mana - 10 }))
        } else if (selectedTool === 'monster' && resources.gold >= 50) {
          clickedRoom.hasMonster = true
          setResources((prev) => ({ ...prev, gold: prev.gold - 50 }))
        }
        setSelectedTool(null)
      }
    }

    canvas.addEventListener('click', handleClick)
    const animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('click', handleClick)
    }
  }, [rooms, selectedTool, resources])

  return (
    <div className="h-full flex flex-col min-h-[420px] bg-[#0f0f0f] p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-amber-500">
        <div className="flex gap-6 font-mono text-xs">
          <div className="text-amber-500">
            GOLD: <span className="text-white font-bold">{resources.gold}</span>
          </div>
          <div className="text-blue-400">
            MANA: <span className="text-white font-bold">{resources.mana}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setSelectedTool('trap')}
          disabled={resources.mana < 10}
          className={`px-4 py-2 font-mono text-[10px] uppercase font-bold border-2 transition-all ${
            selectedTool === 'trap'
              ? 'bg-amber-500 text-black border-amber-500'
              : 'bg-transparent text-amber-500 border-amber-500 hover:bg-amber-500/10'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          Place Trap (10 Mana)
        </button>
        <button
          onClick={() => setSelectedTool('monster')}
          disabled={resources.gold < 50}
          className={`px-4 py-2 font-mono text-[10px] uppercase font-bold border-2 transition-all ${
            selectedTool === 'monster'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-transparent text-red-500 border-red-500 hover:bg-red-500/10'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          Spawn Monster (50 Gold)
        </button>
        {selectedTool && (
          <button
            onClick={() => setSelectedTool(null)}
            className="px-4 py-2 font-mono text-[10px] uppercase font-bold bg-stone-700 text-white hover:bg-stone-600"
          >
            Cancel
          </button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border-4 border-amber-500 bg-[#0f0f0f] cursor-crosshair flex-1"
      />

      <div className="mt-3 p-3 bg-stone-900 border-t-2 border-amber-500">
        <p className="font-mono text-[10px] text-stone-400 uppercase">
          Click rooms to place traps or spawn monsters. Adventurers will attempt to traverse your dungeon.
        </p>
      </div>
    </div>
  )
}
