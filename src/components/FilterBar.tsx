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
    <aside className="w-56 shrink-0 bg-white border-r border-stone-200 min-h-full">
      <div className="sticky top-0 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Neighborhoods
        </p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => onSelectNeighborhood(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedNeighborhood === null
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>All shops</span>
              <span className={`text-xs ${selectedNeighborhood === null ? 'text-amber-200' : 'text-stone-400'}`}>
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
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{n}</span>
                <span className={`text-xs ${selectedNeighborhood === n ? 'text-amber-200' : 'text-stone-400'}`}>
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
