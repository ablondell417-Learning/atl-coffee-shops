export interface CoffeeShop {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  googleRating: number;       // 1.0–5.0
  googleReviewCount: number;
  imageUrl: string;
  website?: string;
  description?: string;
}

export interface UserData {
  favorites: string[];
  notes: Record<string, string>;
}
