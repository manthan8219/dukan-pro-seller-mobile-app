import type { Shop, ShopScreenTarget } from '../models/Shop';

function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return url.replace(/\/$/, '');
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

/**
 * Shape returned by the backend for both GET /shops and GET /shops/discover/nearby.
 */
interface BackendShopDto {
  id: string;
  displayName: string;
  name: string;
  distanceKm: number;
  effectiveMaxServiceRadiusKm: number;
  addressText: string | null;
  city: string | null;
  shopType: string;
  dealIn: string[];
  averageRating: number | null;
  ratingCount: number;
}

function resolveScreenTarget(shopType: string): ShopScreenTarget {
  const t = (shopType ?? '').toUpperCase();
  // Grocery / kirana shops use the product-listing screen
  if (
    t.includes('KIRANA') ||
    t.includes('GROCERY') ||
    t.includes('GENERAL') ||
    t.includes('STORE')
  ) {
    return 'KiranaShop';
  }
  return 'ShopDetail';
}

function mapToShop(dto: BackendShopDto): Shop {
  return {
    id: dto.id,
    name: dto.displayName || dto.name,
    category: dto.shopType ?? '',
    imageUrl: '',
    rating:
      dto.averageRating != null ? dto.averageRating.toFixed(1) : 'N/A',
    distance: dto.distanceKm > 0 ? `${dto.distanceKm.toFixed(1)} km away` : '',
    tags: dto.dealIn ?? [],
    latitude: 0,
    longitude: 0,
    screenTarget: resolveScreenTarget(dto.shopType),
  };
}

/**
 * All shop data comes from the backend — no local/static data.
 *
 * Endpoints (backend):
 *   GET /shops                                              → all active shops
 *   GET /shops/discover/nearby?latitude=&longitude=        → shops deliverable to a coordinate
 */
export class ShopRepository {
  /** All active shops — used when the user has no active address. */
  async getAll(): Promise<Shop[]> {
    const dtos = await apiFetch<BackendShopDto[]>('/shops');
    return dtos.map(mapToShop);
  }

  /**
   * Backend geospatial query — returns shops that can deliver to the given coordinates.
   * The backend evaluates each shop's effective service radius; radius filtering is
   * server-side, so the `radiusKm` param is accepted for API compatibility but unused.
   */
  async getNearbyByCoords(
    lat: number,
    lng: number,
    _radiusKm: number = 5,
  ): Promise<Shop[]> {
    const dtos = await apiFetch<BackendShopDto[]>(
      `/shops/discover/nearby?latitude=${lat}&longitude=${lng}`,
    );
    return dtos.map(mapToShop);
  }

  /**
   * The backend does not expose a zip-based endpoint.
   * Falls back to returning all shops so the screen is never empty.
   */
  async getNearbyByZip(_zip: string): Promise<Shop[]> {
    return this.getAll();
  }
}
