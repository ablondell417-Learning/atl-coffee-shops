export interface WeeklyHours {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

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
  drinkOfTheDay: string;
  offersMatcha: boolean;
  hours: WeeklyHours;
}

export interface UserData {
  favorites: string[];
  notes: Record<string, string>;
}
