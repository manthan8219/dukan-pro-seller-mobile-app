export type ShopScreenTarget = 'KiranaShop' | 'ShopDetail';

export interface Shop {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: string;
  /** Pre-computed distance string returned by the backend (e.g. "1.2 km away"). */
  distance: string;
  tags: string[];
  latitude: number;
  longitude: number;
  screenTarget: ShopScreenTarget;
}
