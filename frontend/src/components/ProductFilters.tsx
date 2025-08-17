import { categories } from "../utils/constants";
import type { ProductFiltersProps } from "../types";

const ProductFilters = ({ filters, setFilters }: ProductFiltersProps) => {
  const resetFilters = () => {
    setFilters({
      category: undefined,
      min: 0,
      max: 5000,
      sort: undefined,
      featured: false,
    });
  };

  return (
    <aside className="w-full h-full md:w-64 bg-neutral-900 p-5 pt-10 space-y-6">
      {/* category filters   */}
      <div>
        <h3 className="font-semibold mb-2">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
                className="text-red-600 accent-red-600 "
              />
              <span className=" capitalize ">{cat}</span>
            </label>
          ))}
          {/* Option to reset category */}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                category: undefined,
              }))
            }
            className="text-xs text-red-600 font-semibold hover:underline mt-1"
          >
            Clear Category
          </button>
        </div>
      </div>
      {/* price Range filter */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.min}
            min={0}
            max={filters.max}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                min: Number(e.target.value),
              }))
            }
            className="w-20 border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-neutral-950 focus:ring-red-600"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.max}
            max={10000}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
            className="w-20 border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-neutral-950 focus:ring-red-600"
          />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select
          value={filters.sort || ""}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              sort: e.target.value || undefined,
            }));
          }}
          className="w-full border rounded p-1 text-sm bg-neutral-950"
        >
          <option value="">-- No Sort --</option>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.featured}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              featured: e.target.checked,
            }));
          }}
          className="text-red-600 accent-red-600 size-4"
        />
        <span className="text-sm">Show Featured Only</span>
      </div>

      {/* Clear All Filters */}
      <div className="pt-5 border-t">
        <button
          onClick={resetFilters}
          className="px-4 py-2 w-full bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};
export default ProductFilters;
