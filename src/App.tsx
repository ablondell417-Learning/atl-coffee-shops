import { useState } from 'react';
import { coffeeShops } from './data/shops';
import { useFavorites } from './hooks/useFavorites';
import { useNotes } from './hooks/useNotes';
import { FilterBar } from './components/FilterBar';
import { ShopGrid } from './components/ShopGrid';
import { NeighborhoodGrid } from './components/NeighborhoodGrid';
import { ShopDetailModal } from './components/ShopDetailModal';
import { AuthModal } from './components/AuthModal';
import { CoffeeShop } from './types';

type AuthView = 'login' | 'signup' | null;

// Parses "7:00 AM" or "12:00 PM" into minutes since midnight
function parseTime(timeStr: string): number {
  const [time, period] = timeStr.trim().split(' ');
  const [hourStr, minStr] = time.split(':');
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minStr, 10);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function isShopOpenNow(shop: CoffeeShop): boolean {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[now.getDay()] as keyof typeof shop.hours;
  const hoursStr = shop.hours[today];

  if (!hoursStr || hoursStr === 'Closed') return false;

  // Hours are stored as "7:00 AM – 7:00 PM" (en dash with spaces)
  const parts = hoursStr.split(' – ');
  if (parts.length < 2) return false;

  const openTime = parseTime(parts[0]);
  const closeTime = parseTime(parts[1]);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Handle spans crossing midnight (e.g. 9:00 AM – 12:00 AM)
  if (closeTime <= openTime) {
    return currentMinutes >= openTime || currentMinutes < closeTime;
  }
  return currentMinutes >= openTime && currentMinutes < closeTime;
}

function App() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [matchaOnly, setMatchaOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<AuthView>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { notes, setNote } = useNotes();

  const hasActiveFilters =
    searchText.trim() !== '' || selectedNeighborhood !== null || matchaOnly || openNow;

  const filteredShops = coffeeShops.filter((shop) => {
    if (selectedNeighborhood && shop.neighborhood !== selectedNeighborhood) return false;
    if (matchaOnly && !shop.offersMatcha) return false;
    if (openNow && !isShopOpenNow(shop)) return false;
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      const matches =
        shop.name.toLowerCase().includes(q) ||
        shop.neighborhood.toLowerCase().includes(q) ||
        (shop.description?.toLowerCase().includes(q) ?? false) ||
        shop.address.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  const activeShop = activeShopId ? coffeeShops.find((s) => s.id === activeShopId) : null;

  return (
    <div
      className="h-screen flex flex-col relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=1920&auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

      {/* Header */}
      <header
        className="relative z-10 text-white shrink-0 border-b border-white/10 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="relative px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ATL Coffee</h1>
            <p className="text-amber-200 text-xs">Atlanta's best coffee shops</p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Favorites badge */}
          {favorites.length > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-700 px-3 py-1.5 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-300">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span className="text-xs font-medium">{favorites.length} saved</span>
            </div>
          )}

          {/* Auth buttons */}
          <button
            onClick={() => setAuthModal('login')}
            className="text-sm font-medium text-amber-100 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => setAuthModal('signup')}
            className="text-sm font-semibold bg-white text-amber-800 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar
        shops={coffeeShops}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={setSelectedNeighborhood}
        matchaOnly={matchaOnly}
        onMatchaOnlyChange={setMatchaOnly}
        openNow={openNow}
        onOpenNowChange={setOpenNow}
        onClearAll={() => {
          setSearchText('');
          setSelectedNeighborhood(null);
          setMatchaOnly(false);
          setOpenNow(false);
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="px-8 py-8">
            {!hasActiveFilters ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow">Explore Atlanta's Coffee Scene</h2>
                  <p className="text-white/60 text-sm mt-1">Select a neighborhood or use the filters above</p>
                </div>
                <NeighborhoodGrid
                  shops={coffeeShops}
                  onSelectNeighborhood={setSelectedNeighborhood}
                />
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-white drop-shadow">
                    {selectedNeighborhood ?? 'All Neighborhoods'}
                  </h2>
                  <span className="text-sm text-white/60">
                    {filteredShops.length} {filteredShops.length === 1 ? 'shop' : 'shops'}
                  </span>
                </div>

                {filteredShops.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-white/50 text-lg">No shops match your filters.</p>
                    <p className="text-white/30 text-sm mt-1">Try adjusting your search or removing a filter.</p>
                  </div>
                ) : (
                  <ShopGrid
                    shops={filteredShops}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetail={setActiveShopId}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Shop detail modal */}
      {activeShop && (
        <ShopDetailModal
          shop={activeShop}
          isFavorite={favorites.includes(activeShop.id)}
          note={notes[activeShop.id] ?? ''}
          onToggleFavorite={toggleFavorite}
          onNoteChange={setNote}
          onClose={() => setActiveShopId(null)}
        />
      )}

      {/* Auth modal */}
      {authModal && (
        <AuthModal
          initialView={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

export default App;
