import React, { createContext, useContext, useEffect, useState } from 'react';
import { AddressService } from '../services/AddressService';
import type { Address, AddressFormData } from '../models/Address';

interface AddressContextValue {
  addresses: Address[];
  activeAddress: Address | null;
  loading: boolean;
  addAddress: (form: AddressFormData) => Promise<void>;
  updateAddress: (id: string, form: AddressFormData) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setActiveAddress: (id: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextValue>({
  addresses: [],
  activeAddress: null,
  loading: true,
  addAddress: async () => {},
  updateAddress: async () => {},
  deleteAddress: async () => {},
  setActiveAddress: async () => {},
});

const service = new AddressService();

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service
      .getAddresses()
      .then((data) => setAddresses(data))
      .catch(() => {
        // Network unavailable or user session not yet synced — start with empty list
      })
      .finally(() => setLoading(false));
  }, []);

  const activeAddress = addresses.find((a) => a.isActive) ?? null;

  const addAddress = async (form: AddressFormData) => {
    const updated = await service.addAddress(form);
    setAddresses(updated);
  };

  const updateAddress = async (id: string, form: AddressFormData) => {
    const updated = await service.updateAddress(id, form);
    setAddresses(updated);
  };

  const deleteAddress = async (id: string) => {
    const updated = await service.deleteAddress(id);
    setAddresses(updated);
  };

  const setActiveAddress = async (id: string) => {
    const updated = await service.setActiveAddress(id);
    setAddresses(updated);
  };

  return (
    <AddressContext.Provider
      value={{ addresses, activeAddress, loading, addAddress, updateAddress, deleteAddress, setActiveAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  return useContext(AddressContext);
}
