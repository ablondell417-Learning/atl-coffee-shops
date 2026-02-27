import { CoffeeShop } from '../types';
import { ShopCard } from './ShopCard';

interface ShopGridProps {
  shops: CoffeeShop[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export function ShopGrid({ shops, favorites, onToggleFavorite, onOpenDetail }: ShopGridProps) {
  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-stone-400">
        <span className="text-5xl mb-4">☕</span>
        <p className="text-lg font-medium">No shops in this neighborhood yet.</p>
        <p className="text-sm mt-1">Try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          isFavorite={favorites.includes(shop.id)}
          onToggleFavorite={onToggleFavorite}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}
