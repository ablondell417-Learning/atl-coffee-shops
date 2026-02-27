import { useEffect, useRef } from 'react';
import { CoffeeShop } from '../types';

function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ShopDetailModalProps {
  shop: CoffeeShop;
  isFavorite: boolean;
  note: string;
  onToggleFavorite: (id: string) => void;
  onNoteChange: (id: string, text: string) => void;
  onClose: () => void;
}

function StarRatingLarge({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= filled ? 'text-amber-500' : 'text-stone-300'}>
            ★
          </span>
        ))}
      </div>
      <span className="font-semibold text-stone-800">{rating.toFixed(1)}</span>
      <span className="text-stone-500 text-sm">({reviewCount.toLocaleString()} reviews)</span>
    </div>
  );
}

export function ShopDetailModal({
  shop,
  isFavorite,
  note,
  onToggleFavorite,
  onNoteChange,
  onClose,
}: ShopDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Image header */}
        <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-2xl bg-stone-200">
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Neighborhood badge */}
          <span className="absolute bottom-3 left-3 bg-amber-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {shop.neighborhood}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-2xl font-bold text-stone-900">{shop.name}</h2>
            <button
              onClick={() => onToggleFavorite(shop.id)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isFavorite
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-400'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>
          </div>

          <StarRatingLarge rating={shop.googleRating} reviewCount={shop.googleReviewCount} />

          {/* Address + website */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-stone-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5 text-stone-400">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.953-5.44 3.953-9.572C20.25 6.01 16.57 2.25 12 2.25c-4.569 0-8.25 3.76-8.25 7.756 0 4.131 2.01 7.488 3.953 9.572a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{shop.address}</span>
            </div>
            {shop.website && isValidHttpUrl(shop.website) && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 text-stone-400">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
                <a
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-amber-700 hover:text-amber-900 hover:underline"
                >
                  {new URL(shop.website).hostname}
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {shop.description && (
            <p className="mt-4 text-stone-600 text-sm leading-relaxed">{shop.description}</p>
          )}

          {/* Personal notes */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              My Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(shop.id, e.target.value)}
              placeholder="Add your personal notes about this shop — best drinks, ideal seats, hours to avoid…"
              rows={4}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
            <p className="text-xs text-stone-400 mt-1">Saved automatically to your browser.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
