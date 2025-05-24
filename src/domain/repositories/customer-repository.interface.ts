import { BaseRepository } from './base-repository.interface';
import { Customer } from '../entities/costumer';

export interface CustomerRepository extends BaseRepository<Customer> {
  findByEmail(email: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  findByName(name: string): Promise<Customer | null>;
}