import { AddressRepository } from '../repositories/AddressRepository';
import type { Address, AddressFormData } from '../models/Address';

/**
 * Business logic for delivery address management.
 * Uses AddressRepository (API when available, otherwise AsyncStorage fallback).
 */
export class AddressService {
  constructor(private repo: AddressRepository = new AddressRepository()) {}

  async getAddresses(): Promise<Address[]> {
    return this.repo.getAll();
  }

  async addAddress(form: AddressFormData): Promise<Address[]> {
    const existing = await this.repo.getAll();
    // First address for this user is automatically set as active
    await this.repo.create(form, existing.length === 0);
    return this.repo.getAll();
  }

  async updateAddress(id: string, form: AddressFormData): Promise<Address[]> {
    await this.repo.update(id, form);
    return this.repo.getAll();
  }

  async deleteAddress(id: string): Promise<Address[]> {
    await this.repo.remove(id);
    return this.repo.getAll();
  }

  async setActiveAddress(id: string): Promise<Address[]> {
    return this.repo.activate(id);
  }
}
