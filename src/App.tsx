import { useState } from 'react';
import { coffeeShops } from './data/shops';
import { useFavorites } from './hooks/useFavorites';
import { useNotes } from './hooks/useNotes';
import { FilterBar } from './components/FilterBar';
import { ShopGrid } from './components/ShopGrid';
import { ShopDetailModal } from './components/ShopDetailModal';
import { AuthModal } from './components/AuthModal';

type AuthView = 'login' | 'signup' | null;

function App() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<AuthView>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { notes, setNote } = useNotes();

  const filteredShops = selectedNeighborhood
    ? coffeeShops.filter((s) => s.neighborhood === selectedNeighborhood)
    : coffeeShops;

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
      <header className="relative z-10 bg-amber-900/80 backdrop-blur-sm text-white shrink-0 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-3">
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
            className="text-sm font-medium text-amber-100 hover:text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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

      {/* Body: sidebar + content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <FilterBar
          shops={coffeeShops}
          selectedNeighborhood={selectedNeighborhood}
          onSelectNeighborhood={setSelectedNeighborhood}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-lg font-semibold text-white drop-shadow">
                {selectedNeighborhood ?? 'All Neighborhoods'}
              </h2>
              <span className="text-sm text-white/60">
                {filteredShops.length} {filteredShops.length === 1 ? 'shop' : 'shops'}
              </span>
            </div>
            <ShopGrid
              shops={filteredShops}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOpenDetail={setActiveShopId}
            />
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
