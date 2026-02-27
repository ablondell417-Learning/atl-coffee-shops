import { CoffeeShop, WeeklyHours } from '../types';

interface ShopCardProps {
  shop: CoffeeShop;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-amber-500">★</span>
      <span className="font-semibold text-stone-800">{rating.toFixed(1)}</span>
    </span>
  );
}

function MatchaIcon() {
  return (
    <span
      title="Matcha available"
      className="flex items-center justify-center"
      aria-label="Matcha available"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
        <path fillRule="evenodd" d="M2.25 6a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM2.25 12a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM2.25 18a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

function getTodayHours(hours: WeeklyHours): string {
  const days: (keyof WeeklyHours)[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  return hours[today];
}

export function ShopCard({ shop, isFavorite, onToggleFavorite, onOpenDetail }: ShopCardProps) {
  const todayHours = getTodayHours(shop.hours);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onOpenDetail(shop.id)}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-stone-200">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(shop.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-stone-400 hover:text-red-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-900 leading-tight">{shop.name}</h3>
          <StarRating rating={shop.googleRating} />
        </div>

        {/* Neighborhood + reviews */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {shop.neighborhood}
          </span>
          <span className="text-xs text-stone-400">({shop.googleReviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Drink of the day + matcha indicator */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs text-stone-500">☕</span>
          <span className="text-xs text-stone-600 truncate">{shop.drinkOfTheDay}</span>
          {shop.offersMatcha && <MatchaIcon />}
        </div>

        {/* Address */}
        <p className="text-xs text-stone-500 truncate mb-1">{shop.address}</p>

        {/* Today's hours */}
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-stone-400 shrink-0">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
          </svg>
          <span className={`text-xs font-medium ${todayHours === 'Closed' ? 'text-red-500' : 'text-stone-500'}`}>
            {todayHours}
          </span>
        </div>
      </div>
    </div>
  );
}
