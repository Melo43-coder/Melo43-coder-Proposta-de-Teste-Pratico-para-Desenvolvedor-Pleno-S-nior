import { BaseEntity } from './base-entity';

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
}