import { CoffeeShop } from '../types';

interface FilterBarProps {
  shops: CoffeeShop[];
  selectedNeighborhood: string | null;
  onSelectNeighborhood: (neighborhood: string | null) => void;
}

export function FilterBar({ shops, selectedNeighborhood, onSelectNeighborhood }: FilterBarProps) {
  const neighborhoods = Array.from(new Set(shops.map((s) => s.neighborhood))).sort();

  const countFor = (neighborhood: string) =>
    shops.filter((s) => s.neighborhood === neighborhood).length;

  return (
    <aside className="w-56 shrink-0 bg-black/40 backdrop-blur-md border-r border-white/10 min-h-full">
      <div className="sticky top-0 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
          Neighborhoods
        </p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => onSelectNeighborhood(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedNeighborhood === null
                  ? 'bg-amber-700 text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>All shops</span>
              <span className={`text-xs ${selectedNeighborhood === null ? 'text-amber-200' : 'text-white/40'}`}>
                {shops.length}
              </span>
            </button>
          </li>
          {neighborhoods.map((n) => (
            <li key={n}>
              <button
                onClick={() => onSelectNeighborhood(n)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedNeighborhood === n
                    ? 'bg-amber-700 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{n}</span>
                <span className={`text-xs ${selectedNeighborhood === n ? 'text-amber-200' : 'text-white/40'}`}>
                  {countFor(n)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
