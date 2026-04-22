export interface Address {
  id: string;
  fullName: string;
  phone: string;
  label: string;
  street: string;    // maps to line1 on backend
  city: string;
  zip: string;       // maps to pin on backend
  isActive: boolean; // maps to isDefault on backend
  /** WGS-84 decimal degrees. Null until the user captures GPS or geocoding runs. */
  latitude: number | null;
  longitude: number | null;
}

export type AddressFormData = Omit<Address, 'id' | 'isActive'>;
