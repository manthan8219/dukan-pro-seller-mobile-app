import type { Address } from '../models/Address';
import type { Shop } from '../models/Shop';
import type { ShopRepository } from '../repositories/ShopRepository';

/**
 * Strategy interface — each implementation decides HOW to query the backend.
 * Swap the strategy in ShopService to change the discovery algorithm globally.
 */
export interface ShopFilterStrategy {
  query(address: Address, repo: ShopRepository): Promise<Shop[]>;
}

// ---------------------------------------------------------------------------
// Strategy 1: Geospatial (primary) — database-level radius query via lat/lng
// ---------------------------------------------------------------------------

/**
 * Passes lat/lng to the backend. The database runs a geospatial query
 * (e.g. PostGIS ST_DWithin or Haversine) and returns only shops within radius.
 * Most accurate — zero client-side filtering.
 */
export class GeospatialStrategy implements ShopFilterStrategy {
  constructor(private radiusKm: number = 5) {}

  async query(address: Address, repo: ShopRepository): Promise<Shop[]> {
    if (address.latitude == null || address.longitude == null) {
      throw new Error('GeospatialStrategy requires latitude and longitude on the address.');
    }
    return repo.getNearbyByCoords(address.latitude, address.longitude, this.radiusKm);
  }
}

// ---------------------------------------------------------------------------
// Strategy 2: Zip-code — backend delivery-area filter
// ---------------------------------------------------------------------------

/**
 * Passes the zip code to the backend. The database filters by delivery area.
 * Used when GPS coordinates are not available for the address.
 */
export class ZipCodeStrategy implements ShopFilterStrategy {
  async query(address: Address, repo: ShopRepository): Promise<Shop[]> {
    return repo.getNearbyByZip(address.zip);
  }
}

// ---------------------------------------------------------------------------
// Strategy 3: Auto — picks the best available method, no dummy fallback
// ---------------------------------------------------------------------------

/**
 * Tries GeospatialStrategy first (when coordinates exist),
 * then falls back to ZipCodeStrategy.
 * Both paths hit the real backend — no local/static data is ever used.
 */
export class AutoStrategy implements ShopFilterStrategy {
  private geoStrategy: GeospatialStrategy;
  private zipStrategy: ZipCodeStrategy;

  constructor(radiusKm: number = 5) {
    this.geoStrategy = new GeospatialStrategy(radiusKm);
    this.zipStrategy = new ZipCodeStrategy();
  }

  async query(address: Address, repo: ShopRepository): Promise<Shop[]> {
    if (address.latitude != null && address.longitude != null) {
      try {
        return await this.geoStrategy.query(address, repo);
      } catch {
        // GPS query failed — try zip code as fallback
      }
    }
    return this.zipStrategy.query(address, repo);
  }
}
