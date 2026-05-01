export default function AnalyticsFilterBar({ filters, onChange, onReset, departments = [], categories = [] }) {
  const selectClassName = 'w-full p-3 rounded-lg bg-[#020617] text-white border border-gray-600 focus:outline-none';

  return (
    <section className="portal-panel p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="portal-heading text-lg">Analytics Filters</h3>
          <p className="portal-subtext text-sm">Filter the dashboard before charts are rendered.</p>
        </div>
        <button type="button" onClick={onReset} className="portal-button-secondary px-4 py-2 text-sm">
          Reset Filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm text-white/75">
          <span>Start Date</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange('startDate', event.target.value)}
            className="portal-input w-full"
          />
        </label>

        <label className="space-y-2 text-sm text-white/75">
          <span>End Date</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange('endDate', event.target.value)}
            className="portal-input w-full"
          />
        </label>

        <label className="space-y-2 text-sm text-white/75">
          <span>Department</span>
          <select
            value={filters.department}
            onChange={(event) => onChange('department', event.target.value)}
            className={selectClassName}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-white/75">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange('category', event.target.value)}
            className={selectClassName}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
