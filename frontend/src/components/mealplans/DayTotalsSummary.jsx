import { DAILY_VALUES, NUTRIENT_META, MACRO_KEYS } from '../../constants/dailyValues'

export function DayTotalsSummary({ totals }) {
  if (!totals || Object.keys(totals).length === 0) {
    return <p className="text-xs text-gray-300 italic">No nutrition data yet</p>
  }

  const macros = MACRO_KEYS.filter((k) => totals[k])

  return (
    <div className="grid grid-cols-5 gap-2">
      {macros.map((key) => {
        const data = totals[key]
        const meta = NUTRIENT_META[key]
        const dv = DAILY_VALUES[key]
        const percent = dv ? Math.round((data.value / dv) * 100) : null
        return (
          <div key={key} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">{meta.icon} {meta.label}</p>
            <p className="text-sm font-semibold text-gray-800">{data.value}{data.unit}</p>
            {percent !== null && <p className="text-xs text-gray-400">{percent}% DV</p>}
          </div>
        )
      })}
    </div>
  )
}