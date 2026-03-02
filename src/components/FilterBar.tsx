import { CoffeeShop } from '../types';

interface FilterBarProps {
  shops: CoffeeShop[];
  searchText: string;
  onSearchTextChange: (text: string) => void;
  selectedNeighborhood: string | null;
  onSelectNeighborhood: (neighborhood: string | null) => void;
  matchaOnly: boolean;
  onMatchaOnlyChange: (val: boolean) => void;
  openNow: boolean;
  onOpenNowChange: (val: boolean) => void;
  onClearAll: () => void;
}

export function FilterBar({
  shops,
  searchText,
  onSearchTextChange,
  selectedNeighborhood,
  onSelectNeighborhood,
  matchaOnly,
  onMatchaOnlyChange,
  openNow,
  onOpenNowChange,
  onClearAll,
}: FilterBarProps) {
  const neighborhoods = Array.from(new Set(shops.map((s) => s.neighborhood))).sort();
  const hasActiveFilters =
    searchText !== '' || selectedNeighborhood !== null || matchaOnly || openNow;

  return (
    <div className="relative z-10 bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0">
      <div className="px-6 py-3 flex items-center gap-3 flex-wrap">

        {/* Search input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search shops, neighborhoods…"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            aria-label="Search coffee shops"
            className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-lg pl-9 pr-3 py-2 border border-white/10 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-colors"
          />
        </div>

        {/* Neighborhood dropdown */}
        <div className="relative">
          <select
            value={selectedNeighborhood ?? ''}
            onChange={(e) => onSelectNeighborhood(e.target.value || null)}
            aria-label="Filter by neighborhood"
            className="appearance-none bg-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-2 border border-white/10 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="" style={{ backgroundColor: '#1c1917' }}>All Neighborhoods</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n} style={{ backgroundColor: '#1c1917' }}>{n}</option>
            ))}
          </select>
          {/* Chevron icon */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Matcha toggle */}
        <button
          onClick={() => onMatchaOnlyChange(!matchaOnly)}
          aria-pressed={matchaOnly}
          className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
            matchaOnly
              ? 'bg-green-700/80 border-green-500/50 text-white'
              : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
          }`}
        >
          <span aria-hidden="true">🍵</span>
          <span>Matcha</span>
        </button>

        {/* Open now toggle */}
        <button
          onClick={() => onOpenNowChange(!openNow)}
          aria-pressed={openNow}
          className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
            openNow
              ? 'bg-amber-700/80 border-amber-500/50 text-white'
              : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
          }`}
        >
          <span aria-hidden="true">🕐</span>
          <span>Open Now</span>
        </button>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors whitespace-nowrap ml-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
            <span>Clear filters</span>
          </button>
        )}

      </div>
    </div>
  );
}
