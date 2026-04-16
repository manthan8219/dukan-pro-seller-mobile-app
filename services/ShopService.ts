import { ShopRepository } from '../repositories/ShopRepository';
import { AutoStrategy, type ShopFilterStrategy } from '../strategies/ShopFilterStrategy';
import type { Address } from '../models/Address';
import type { Shop } from '../models/Shop';

/**
 * Orchestrates nearby-shop discovery.
 * All data comes from the backend — no static/dummy data.
 *
 * To change the discovery algorithm, swap the strategy here:
 *   new ShopService(new GeospatialStrategy(10))  — 10 km radius, requires GPS
 *   new ShopService(new ZipCodeStrategy())        — zip-based backend filter only
 *   new ShopService(new AutoStrategy())           — GPS first, zip fallback (default)
 */
export class ShopService {
  private repo: ShopRepository;
  private strategy: ShopFilterStrategy;

  constructor(
    strategy: ShopFilterStrategy = new AutoStrategy(),
    repo: ShopRepository = new ShopRepository(),
  ) {
    this.strategy = strategy;
    this.repo = repo;
  }

  /**
   * Returns shops near the active address from the backend.
   * When no address is set, fetches all shops (GET /shops) so the
   * home screen is never empty on first launch.
   */
  async getNearbyShops(activeAddress: Address | null): Promise<Shop[]> {
    if (!activeAddress) {
      return this.repo.getAll();
    }
    return this.strategy.query(activeAddress, this.repo);
  }
}

/** App-wide singleton. Change the strategy here to affect all screens at once. */
export const shopService = new ShopService(new AutoStrategy(5));
