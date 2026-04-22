import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_USER_ID_KEY = '@buyer:backendUserId';

function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return url.replace(/\/$/, '');
}

export interface PlaceOrderItem {
  shopProductId: string;
  quantity: number;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface PlaceOrderParams {
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  items: PlaceOrderItem[];
}

export interface OrderItemResponse {
  id: string;
  shopProductId: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
  productNameSnapshot: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  shopId: string;
  shopDisplayName?: string;
  deliveryAddressId: string;
  status: string;
  itemsSubtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  paymentMethod: string | null;
  deliveredAt: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}

export async function getOrder(orderId: string): Promise<OrderResponse | null> {
  const userId = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
  if (!userId) throw new Error('Not logged in. Please sign in and try again.');

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/users/${userId}/orders/${orderId}`, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) return null;

  const text = await res.text();
  if (!res.ok) {
    // Fall back to list search if single-order endpoint doesn't exist
    return null;
  }

  return JSON.parse(text) as OrderResponse;
}

export async function getOrders(): Promise<OrderResponse[]> {
  const userId = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
  if (!userId) throw new Error('Not logged in. Please sign in and try again.');

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/users/${userId}/orders`, {
    headers: { Accept: 'application/json' },
  });

  const text = await res.text();
  if (!res.ok) {
    let message = `Failed to load orders (${res.status})`;
    try {
      const data = JSON.parse(text) as { message?: string | string[] };
      if (typeof data.message === 'string') message = data.message;
      else if (Array.isArray(data.message)) message = data.message.join('. ');
    } catch { /* use default */ }
    throw new Error(message);
  }

  return JSON.parse(text) as OrderResponse[];
}

export async function placeOrder(params: PlaceOrderParams): Promise<OrderResponse[]> {
  const userId = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
  if (!userId) throw new Error('Not logged in. Please sign in and try again.');

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/users/${userId}/orders/checkout`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const text = await res.text();
  if (!res.ok) {
    let message = `Order failed (${res.status})`;
    try {
      const data = JSON.parse(text) as { message?: string | string[] };
      if (typeof data.message === 'string') message = data.message;
      else if (Array.isArray(data.message)) message = data.message.join('. ');
    } catch { /* use default */ }
    throw new Error(message);
  }

  return JSON.parse(text) as OrderResponse[];
}
