import { useState } from 'react'

interface PredictionResult {
  adventurerId: string
  adventurerName: string
  survivalProbability: number
  expectedGold: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
}

export const MLLab = () => {
  const [predictions] = useState<PredictionResult[]>([
    {
      adventurerId: 'warrior-1',
      adventurerName: 'Throk the Warrior',
      survivalProbability: 0.72,
      expectedGold: 145,
      riskLevel: 'medium',
      recommendations: ['High HP ratio favors survival', 'Avoid trap-heavy corridors'],
    },
    {
      adventurerId: 'mage-1',
      adventurerName: 'Zara the Mage',
      survivalProbability: 0.45,
      expectedGold: 85,
      riskLevel: 'high',
      recommendations: ['Low health detected', 'Damage taken exceeds output'],
    },
    {
      adventurerId: 'rogue-1',
      adventurerName: 'Vex the Rogue',
      survivalProbability: 0.88,
      expectedGold: 230,
      riskLevel: 'low',
      recommendations: ['Strategy is effective', 'Continue current path'],
    },
  ])

  const riskColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  }

  return (
    <div className="h-full flex flex-col min-h-[420px] bg-[#0f0f0f] p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-amber-500">
        <div className="font-mono text-[10px] text-amber-500 tracking-widest">
          ML_SURVIVAL_PREDICTOR
        </div>
        <div className="font-mono text-xs text-stone-400">
          Model: XGBoost v2.1
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {predictions.map((pred) => (
          <div
            key={pred.adventurerId}
            className="bg-stone-900 border-2 border-stone-700 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-white font-mono font-bold text-sm">
                  {pred.adventurerName}
                </div>
                <div className="text-stone-500 font-mono text-[9px] uppercase">
                  ID: {pred.adventurerId}
                </div>
              </div>
              <div
                className={`${riskColors[pred.riskLevel]} text-black px-3 py-1 font-mono text-[9px] font-bold uppercase`}
              >
                {pred.riskLevel} RISK
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-black p-3 border border-stone-800">
                <div className="text-stone-500 font-mono text-[8px] uppercase mb-1">
                  Survival Probability
                </div>
                <div className="text-amber-500 font-mono text-2xl font-bold">
                  {(pred.survivalProbability * 100).toFixed(0)}%
                </div>
                <div className="w-full h-2 bg-stone-800 rounded overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${pred.survivalProbability * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-black p-3 border border-stone-800">
                <div className="text-stone-500 font-mono text-[8px] uppercase mb-1">
                  Expected Gold
                </div>
                <div className="text-green-500 font-mono text-2xl font-bold">
                  {pred.expectedGold}
                </div>
                <div className="text-stone-600 font-mono text-[8px] mt-1">
                  Based on current path
                </div>
              </div>
            </div>

            <div className="bg-black p-3 border border-stone-800">
              <div className="text-stone-500 font-mono text-[8px] uppercase mb-2">
                Recommendations
              </div>
              <div className="space-y-1">
                {pred.recommendations.map((rec, i) => (
                  <div key={i} className="text-stone-400 font-mono text-[9px] flex items-start">
                    <span className="text-amber-500 mr-2">▸</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-stone-900 border-t-2 border-amber-500 p-3">
        <p className="font-mono text-[9px] text-stone-400">
          Model trained on 2,500+ dungeon runs. Features: HP ratio, stamina, trap encounters, damage metrics, action diversity.
        </p>
      </div>
    </div>
  )
}
