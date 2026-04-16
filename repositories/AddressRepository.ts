import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Address, AddressFormData } from '../models/Address';

const BACKEND_USER_ID_KEY = '@buyer:backendUserId';

function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return url.replace(/\/$/, '');
}

async function getUserId(): Promise<string> {
  const id = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
  if (!id) throw new Error('User session not found. Please log in again.');
  return id;
}

interface BackendAddressDto {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
}

function mapDto(dto: BackendAddressDto): Address {
  return {
    id: dto.id,
    label: dto.label,
    street: dto.street,
    city: dto.city,
    zip: dto.zip ?? '',
    isActive: dto.isActive,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
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
    } catch { /* use default */ }
    throw new Error(message);
  }

  return JSON.parse(text) as T;
}

/**
 * All address data is persisted against the authenticated user in the backend.
 *
 * Required backend endpoints (NestJS):
 *   GET    /customers/:userId/addresses                    → BackendAddressDto[]
 *   POST   /customers/:userId/addresses                    → BackendAddressDto
 *   PATCH  /customers/:userId/addresses/:addressId         → BackendAddressDto
 *   DELETE /customers/:userId/addresses/:addressId         → 204 No Content
 *   PATCH  /customers/:userId/addresses/:addressId/activate → BackendAddressDto[]
 *     (sets the given address as active, deactivates all others for that customer)
 */
export class AddressRepository {
  async getAll(): Promise<Address[]> {
    const userId = await getUserId();
    const dtos = await apiFetch<BackendAddressDto[]>(`/customers/${userId}/addresses`);
    return dtos.map(mapDto);
  }

  async create(form: AddressFormData, isActive: boolean): Promise<Address> {
    const userId = await getUserId();
    const dto = await apiFetch<BackendAddressDto>(`/customers/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify({ ...form, isActive }),
    });
    return mapDto(dto);
  }

  async update(id: string, patch: Partial<AddressFormData>): Promise<Address> {
    const userId = await getUserId();
    const dto = await apiFetch<BackendAddressDto>(`/customers/${userId}/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return mapDto(dto);
  }

  async remove(id: string): Promise<void> {
    const userId = await getUserId();
    await apiFetch<void>(`/customers/${userId}/addresses/${id}`, { method: 'DELETE' });
  }

  /**
   * Sets one address as active and deactivates all others for this customer.
   * Returns the full updated list.
   */
  async activate(id: string): Promise<Address[]> {
    const userId = await getUserId();
    const dtos = await apiFetch<BackendAddressDto[]>(
      `/customers/${userId}/addresses/${id}/activate`,
      { method: 'PATCH' },
    );
    return dtos.map(mapDto);
  }
}
