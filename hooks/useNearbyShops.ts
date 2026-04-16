import { useEffect, useState, useRef } from 'react';
import type { Shop } from '../models/Shop';
import type { Address } from '../models/Address';
import { shopService } from '../services/ShopService';

interface NearbyShopsState {
  shops: Shop[];
  loading: boolean;
  error: string | null;
  /** Call to manually re-trigger the query (e.g. pull-to-refresh). */
  refetch: () => void;
}

/**
 * Fetches nearby shops whenever the active address changes.
 * Cancels in-flight requests if the address changes mid-flight.
 *
 * @param activeAddress  The currently active delivery address (or null if none set).
 * @param screenFilter   Optional: filter result by screenTarget (e.g. 'KiranaShop').
 */
export function useNearbyShops(
  activeAddress: Address | null,
  screenFilter?: Shop['screenTarget'],
): NearbyShopsState {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Use a ref to cancel stale responses when address changes quickly
  const cancelRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    cancelRef.current = false;

    setLoading(true);
    setError(null);

    shopService
      .getNearbyShops(activeAddress)
      .then((result) => {
        if (cancelled) return;
        const filtered = screenFilter
          ? result.filter((s) => s.screenTarget === screenFilter)
          : result;
        setShops(filtered);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load nearby shops.';
        setError(message);
        setShops([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAddress?.id, activeAddress?.latitude, activeAddress?.longitude, screenFilter, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { shops, loading, error, refetch };
}
