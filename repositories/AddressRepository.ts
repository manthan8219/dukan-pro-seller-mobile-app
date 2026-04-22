import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Address, AddressFormData } from '../models/Address';

const BACKEND_USER_ID_KEY = '@buyer:backendUserId';
const STORAGE_KEY = '@buyer:addresses';

/** After a real API failure, stay on device storage until the app process restarts. */
let remoteAddressApiDown = false;

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function getApiBaseUrlOrNull(): string | null {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) return null;
  return url.replace(/\/$/, '');
}

// ——— Backend DTO shapes ———

interface BackendAddressDto {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  pin: string;
  tag: 'home' | 'office' | 'other';
  label: string;
  isDefault: boolean;
  latitude: number | null;
  longitude: number | null;
}

function mapDto(dto: BackendAddressDto): Address {
  return {
    id: dto.id,
    fullName: dto.fullName ?? '',
    phone: dto.phone ?? '',
    label: dto.label || dto.tag,
    street: dto.line1,
    city: dto.city,
    zip: dto.pin,
    isActive: dto.isDefault,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
  };
}

function tagFromLabel(label: string): 'home' | 'office' | 'other' {
  const l = label.toLowerCase();
  if (l === 'home') return 'home';
  if (l === 'office' || l === 'work') return 'office';
  return 'other';
}

function buildCreateBody(form: AddressFormData, isActive: boolean): Record<string, unknown> {
  const tag = tagFromLabel(form.label);
  return {
    fullName: form.fullName,
    phone: form.phone,
    line1: form.street,
    city: form.city,
    pin: form.zip,
    tag,
    // Only send label for "other" tags (backend ignores it for home/office)
    ...(tag === 'other' ? { label: form.label } : {}),
    setAsDefault: isActive,
    ...(form.latitude != null ? { latitude: form.latitude } : {}),
    ...(form.longitude != null ? { longitude: form.longitude } : {}),
  };
}

function buildUpdateBody(patch: Partial<AddressFormData>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (patch.fullName != null) body.fullName = patch.fullName;
  if (patch.phone != null) body.phone = patch.phone;
  if (patch.street != null) body.line1 = patch.street;
  if (patch.city != null) body.city = patch.city;
  if (patch.zip != null) body.pin = patch.zip;
  if (patch.label != null) {
    const tag = tagFromLabel(patch.label);
    body.tag = tag;
    if (tag === 'other') body.label = patch.label;
  }
  if (patch.latitude != null) body.latitude = patch.latitude;
  if (patch.longitude != null) body.longitude = patch.longitude;
  return body;
}

// ——— API helper ———

async function apiFetch<T>(baseUrl: string, path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!res.ok) {
    let message = `API error (${res.status})`;
    try {
      const data = JSON.parse(text) as { message?: string | string[] };
      if (typeof data.message === 'string') message = data.message;
      else if (Array.isArray(data.message)) message = data.message.join('. ');
    } catch {
      /* use default */
    }
    throw new Error(message);
  }

  return JSON.parse(text) as T;
}

// ——— Local (AsyncStorage) fallback ———

async function localGetAll(): Promise<Address[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Address[];
  } catch {
    return [];
  }
}

async function localSaveAll(addresses: Address[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch { /* storage unavailable */ }
}

async function localCreate(form: AddressFormData, isActive: boolean): Promise<Address> {
  const addresses = await localGetAll();
  const newAddress: Address = { ...form, id: generateId(), isActive };
  let updated = [...addresses, newAddress];
  if (newAddress.isActive) {
    updated = updated.map((a) => ({ ...a, isActive: a.id === newAddress.id }));
  }
  await localSaveAll(updated);
  return newAddress;
}

async function localUpdate(id: string, patch: Partial<AddressFormData>): Promise<Address> {
  const addresses = await localGetAll();
  const idx = addresses.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Address not found');
  const merged = { ...addresses[idx], ...patch } as Address;
  const next = addresses.map((a, i) => (i === idx ? merged : a));
  await localSaveAll(next);
  return merged;
}

async function localRemove(id: string): Promise<void> {
  const addresses = await localGetAll();
  const wasActive = addresses.find((a) => a.id === id)?.isActive ?? false;
  const remaining = addresses.filter((a) => a.id !== id);
  if (wasActive && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isActive: true };
  }
  await localSaveAll(remaining);
}

async function localActivate(id: string): Promise<Address[]> {
  const addresses = await localGetAll();
  const next = addresses.map((a) => ({ ...a, isActive: a.id === id }));
  await localSaveAll(next);
  return next;
}

function canAttemptRemote(): boolean {
  return !remoteAddressApiDown && getApiBaseUrlOrNull() != null;
}

/**
 * Persists delivery addresses on the backend.
 *
 * Remote endpoints:
 *   GET    /users/:userId/delivery-addresses
 *   POST   /users/:userId/delivery-addresses
 *   PATCH  /users/:userId/delivery-addresses/:addressId
 *   DELETE /users/:userId/delivery-addresses/:addressId
 *   (activate = PATCH with { setAsDefault: true })
 */
export class AddressRepository {
  async getAll(): Promise<Address[]> {
    const uid = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
    if (!canAttemptRemote() || !uid) return localGetAll();
    const baseUrl = getApiBaseUrlOrNull()!;
    try {
      const dtos = await apiFetch<BackendAddressDto[]>(baseUrl, `/users/${uid}/delivery-addresses`);
      return dtos.map(mapDto);
    } catch {
      remoteAddressApiDown = true;
      return localGetAll();
    }
  }

  async create(form: AddressFormData, isActive: boolean): Promise<Address> {
    const uid = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
    if (!canAttemptRemote() || !uid) return localCreate(form, isActive);
    const baseUrl = getApiBaseUrlOrNull()!;
    try {
      const dto = await apiFetch<BackendAddressDto>(baseUrl, `/users/${uid}/delivery-addresses`, {
        method: 'POST',
        body: JSON.stringify(buildCreateBody(form, isActive)),
      });
      return mapDto(dto);
    } catch {
      remoteAddressApiDown = true;
      return localCreate(form, isActive);
    }
  }

  async update(id: string, patch: Partial<AddressFormData>): Promise<Address> {
    const uid = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
    if (!canAttemptRemote() || !uid) return localUpdate(id, patch);
    const baseUrl = getApiBaseUrlOrNull()!;
    try {
      const dto = await apiFetch<BackendAddressDto>(
        baseUrl,
        `/users/${uid}/delivery-addresses/${id}`,
        { method: 'PATCH', body: JSON.stringify(buildUpdateBody(patch)) },
      );
      return mapDto(dto);
    } catch {
      remoteAddressApiDown = true;
      return localUpdate(id, patch);
    }
  }

  async remove(id: string): Promise<void> {
    const uid = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
    if (!canAttemptRemote() || !uid) { await localRemove(id); return; }
    const baseUrl = getApiBaseUrlOrNull()!;
    try {
      await apiFetch<void>(baseUrl, `/users/${uid}/delivery-addresses/${id}`, { method: 'DELETE' });
    } catch {
      remoteAddressApiDown = true;
      await localRemove(id);
    }
  }

  async activate(id: string): Promise<Address[]> {
    const uid = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
    if (!canAttemptRemote() || !uid) return localActivate(id);
    const baseUrl = getApiBaseUrlOrNull()!;
    try {
      // Backend has no separate activate endpoint — PATCH with setAsDefault: true
      await apiFetch<BackendAddressDto>(
        baseUrl,
        `/users/${uid}/delivery-addresses/${id}`,
        { method: 'PATCH', body: JSON.stringify({ setAsDefault: true }) },
      );
      // Fetch fresh list so isDefault flags are accurate
      const dtos = await apiFetch<BackendAddressDto[]>(baseUrl, `/users/${uid}/delivery-addresses`);
      return dtos.map(mapDto);
    } catch {
      remoteAddressApiDown = true;
      return localActivate(id);
    }
  }
}
