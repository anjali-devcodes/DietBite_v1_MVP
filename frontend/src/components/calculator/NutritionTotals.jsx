import { DAILY_VALUES, NUTRIENT_META, MACRO_KEYS } from '../../constants/dailyValues'

function PercentBar({ percent }) {
  const clamped = Math.min(percent, 100)
  const color = percent > 100 ? 'bg-red-400' : percent > 70 ? 'bg-green-500' : 'bg-green-300'
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}

export function NutritionTotals({ totals }) {
  const nutrientKeys = Object.keys(totals)
  if (nutrientKeys.length === 0) return null

  const macros = MACRO_KEYS.filter((k) => totals[k])
  const micros = nutrientKeys.filter((k) => !MACRO_KEYS.includes(k))

  const renderNutrient = (key) => {
    const data = totals[key]
    const meta = NUTRIENT_META[key] || { label: key, icon: '•' }
    const dv = DAILY_VALUES[key]
    const percent = dv ? Math.round((data.value / dv) * 100) : null

    return (
      <div key={key} className="bg-white rounded-lg border border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 flex items-center gap-1.5">
            <span>{meta.icon}</span> {meta.label}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {data.value}{data.unit}
          </span>
        </div>
        {percent !== null && (
          <>
            <PercentBar percent={percent} />
            <p className="text-xs text-gray-400 mt-1">{percent}% of daily value</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Macronutrients (Total)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {macros.map(renderNutrient)}
        </div>
      </div>

      {micros.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Vitamins & Minerals (Total)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {micros.map(renderNutrient)}
          </div>
        </div>
      )}
    </div>
  )
}