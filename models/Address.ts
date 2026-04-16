export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string;
  isActive: boolean;
  /** WGS-84 decimal degrees. Null until the user captures GPS or geocoding runs. */
  latitude: number | null;
  longitude: number | null;
}

export type AddressFormData = Omit<Address, 'id' | 'isActive'>;
