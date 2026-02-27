import { CoffeeShop } from '../types';
import { neighborhoodImages, fallbackNeighborhoodImage } from '../data/neighborhoods';

interface NeighborhoodGridProps {
  shops: CoffeeShop[];
  onSelectNeighborhood: (neighborhood: string) => void;
}

export function NeighborhoodGrid({ shops, onSelectNeighborhood }: NeighborhoodGridProps) {
  const neighborhoods = Array.from(new Set(shops.map((s) => s.neighborhood))).sort();
  const countFor = (n: string) => shops.filter((s) => s.neighborhood === n).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {neighborhoods.map((n) => {
        const image = neighborhoodImages[n] ?? fallbackNeighborhoodImage;
        const count = countFor(n);

        return (
          <button
            key={n}
            onClick={() => onSelectNeighborhood(n)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group h-48 text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {/* Neighborhood photo */}
            <img
              src={image}
              alt={n}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-colors duration-300" />

            {/* Glassmorphism info pill at top-right */}
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {count} {count === 1 ? 'shop' : 'shops'}
            </div>

            {/* Neighborhood name */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg leading-tight drop-shadow">{n}</h3>
              <p className="text-white/70 text-xs mt-0.5">Tap to explore →</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
