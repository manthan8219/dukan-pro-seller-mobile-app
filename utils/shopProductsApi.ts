/**
 * Normalizes shop product payloads from GET /shops/:id/products
 * (handles wrapped JSON, snake_case, alternate field names).
 */

export interface UiShopProduct {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** Backend may return a bare array or { data | products | items | results: [...] }. */
export function extractProductRows(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  const o = asRecord(json);
  if (!o) return [];
  for (const key of ['data', 'products', 'items', 'results', 'rows']) {
    const v = o[key];
    if (Array.isArray(v)) return v;
  }
  return [];
}

function pickString(r: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function pickNumber(r: Record<string, unknown>, ...keys: string[]): number | null {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

/**
 * Maps one API row to UI. Supports camelCase and snake_case; price in paise (minor) or rupees.
 */
export function normalizeShopProductRow(row: unknown): UiShopProduct | null {
  const r = asRecord(row);
  if (!r) return null;

  const id =
    pickString(r, 'productId', 'product_id', 'id') ||
    (typeof r.id === 'string' ? r.id : typeof r.id === 'number' ? String(r.id) : '');
  const name = pickString(r, 'productName', 'product_name', 'name', 'title');
  if (!id || !name) return null;

  const priceMinor = pickNumber(r, 'priceMinor', 'price_minor', 'priceInPaise', 'price_in_paise');
  const priceRupees = pickNumber(r, 'price', 'unitPrice', 'unit_price', 'sellingPrice', 'selling_price', 'amount');

  let price = 0;
  if (priceMinor != null) price = priceMinor / 100;
  else if (priceRupees != null) price = priceRupees;

  const unit = pickString(r, 'unit');
  const category =
    pickString(r, 'productCategory', 'product_category', 'category') || 'Other';
  const image = pickString(
    r,
    'displayImageUrl',
    'display_image_url',
    'imageUrl',
    'image_url',
    'image',
  );
  const notes = pickString(r, 'listingNotes', 'listing_notes', 'description', 'notes');

  const parts = [category !== 'Other' ? category : null, unit].filter(Boolean);
  const desc = parts.length ? parts.join(' · ') : notes || '';

  return { id, name, desc, price, image, category };
}

function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
}

async function fetchProductsOnce(shopId: string, query: string): Promise<{ ok: boolean; status: number; rows: unknown[] }> {
  const base = getApiBaseUrl();
  if (!base) {
    return { ok: false, status: 0, rows: [] };
  }
  const url = `${base}/shops/${encodeURIComponent(shopId)}/products${query}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, rows: [] };
  }
  try {
    const json = text ? JSON.parse(text) : null;
    return { ok: true, status: res.status, rows: extractProductRows(json) };
  } catch {
    return { ok: false, status: res.status, rows: [] };
  }
}

function rowsToProducts(rows: unknown[]): UiShopProduct[] {
  return rows.map(normalizeShopProductRow).filter((p): p is UiShopProduct => p != null);
}

/**
 * Loads listed products first (`?listedOnly=true`). If that succeeds but returns no
 * normalizable rows, retries without the query (some backends ignore the flag or use
 * different listing rules).
 */
export async function fetchShopProducts(shopId: string): Promise<{
  products: UiShopProduct[];
  error: string | null;
}> {
  const base = getApiBaseUrl();
  if (!base) {
    return { products: [], error: 'EXPO_PUBLIC_API_URL is not configured.' };
  }

  const queries = ['?listedOnly=true', ''] as const;
  let lastError: string | null = null;
  let lastOkRows: unknown[] = [];

  for (const q of queries) {
    try {
      const { ok, status, rows } = await fetchProductsOnce(shopId, q);
      if (!ok) {
        lastError = `API error ${status}`;
        continue;
      }
      lastOkRows = rows;
      const products = rowsToProducts(rows);
      if (products.length > 0) {
        return { products, error: null };
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'Failed to load products';
    }
  }

  const products = rowsToProducts(lastOkRows);
  return {
    products,
    error: products.length === 0 && lastError ? lastError : null,
  };
}
