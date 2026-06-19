const FOOD_TYPES = ['raw', 'cooked', 'processed', 'beverage', 'recipe']
const REGIONS = ['Pan-India', 'North India', 'South India', 'East India', 'Central India']

export function FoodFilters({ filters, categories, onChange, onClear }) {
  const hasActiveFilters = filters.category || filters.food_type || filters.region

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        value={filters.food_type}
        onChange={(e) => onChange({ ...filters, food_type: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="">All Types</option>
        {FOOD_TYPES.map((t) => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={(e) => onChange({ ...filters, region: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="">All Regions</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 font-medium px-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}