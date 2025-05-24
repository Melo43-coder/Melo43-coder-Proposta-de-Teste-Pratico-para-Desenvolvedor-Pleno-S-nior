// src/infrastructure/database/mongodb/repositories/customer-repository.ts
import { Customer } from '../../../../domain/entities/costumer';
import { CustomerRepository } from '../../../../domain/repositories/customer-repository.interface';
import { CustomerModel } from '../schemas/customer.schema';
import mongoose, { MongooseError } from 'mongoose';

// Interface para erros do MongoDB com código
interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
}

export class MongoCustomerRepository implements CustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    console.log(`Buscando cliente com ID ${id}`);
    try {
      const customer = await CustomerModel.findById(id).exec();
      
      if (!customer) {
        console.log(`Cliente com ID ${id} não encontrado`);
        return null;
      }
      
      console.log(`Cliente com ID ${id} encontrado:`, customer);
      return this.mapToEntity(customer);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao buscar cliente com ID ${id}:`, err.message);
      return null;
    }
  }

  async findAll(): Promise<Customer[]> {
    console.log('Buscando todos os clientes');
    try {
      const customers = await CustomerModel.find().exec();
      console.log(`Encontrados ${customers.length} clientes`);
      
      return customers.map(customer => this.mapToEntity(customer));
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Erro ao buscar todos os clientes:', err.message);
      return [];
    }
  }

  async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    console.log('Tentando criar cliente:', customer);
    try {
      // Verifica se já existe um cliente com o mesmo email
      if (customer.email) {
        const existingByEmail = await this.findByEmail(customer.email);
        if (existingByEmail) {
          console.log(`Cliente com email ${customer.email} já existe.`);
          return existingByEmail;
        }
      }
      
      // Verifica se já existe um cliente com o mesmo telefone
      if (customer.phone) {
        const existingByPhone = await this.findByPhone(customer.phone);
        if (existingByPhone) {
          console.log(`Cliente com telefone ${customer.phone} já existe.`);
          return existingByPhone;
        }
      }
      
      // Verifica se já existe um cliente com o mesmo nome
      if (customer.name) {
        const existingByName = await this.findByName(customer.name);
        if (existingByName) {
          console.log(`Cliente com nome ${customer.name} já existe.`);
          return existingByName;
        }
      }
      
      // Se não existe, cria um novo cliente
      const newCustomer = new CustomerModel({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt || new Date(),
        updatedAt: customer.updatedAt || new Date()
      });
      
      const savedCustomer = await newCustomer.save();
      console.log('Cliente criado com sucesso:', savedCustomer);
      
      return this.mapToEntity(savedCustomer);
    } catch (error: unknown) {
      console.error('Erro ao criar cliente:', error);
      
      // Verifica se é um erro de duplicação
      const mongoError = error as MongoError;
      if (mongoError.code === 11000 && mongoError.keyValue) {
        console.log('Erro de duplicação:', mongoError.keyValue);
        
        // Tenta encontrar o cliente existente
        let existingCustomer = null;
        
        if (mongoError.keyValue.email) {
          existingCustomer = await this.findByEmail(mongoError.keyValue.email);
        } else if (mongoError.keyValue.phone) {
          existingCustomer = await this.findByPhone(mongoError.keyValue.phone);
        }
        
        if (existingCustomer) {
          console.log('Retornando cliente existente:', existingCustomer);
          return existingCustomer;
        }
      }
      
      throw error;
    }
  }

  async update(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
    console.log(`Tentando atualizar cliente com ID ${id}:`, customerData);
    try {
      // Se estiver atualizando o email, verifica se já existe outro cliente com esse email
      if (customerData.email) {
        const existingCustomer = await CustomerModel.findOne({ 
          email: customerData.email,
          _id: { $ne: id }
        }).exec();
        
        if (existingCustomer) {
          console.log(`Outro cliente já usa o email ${customerData.email}. Atualização não permitida.`);
          throw new Error(`Email ${customerData.email} já está em uso por outro cliente.`);
        }
      }
      
      // Se estiver atualizando o telefone, verifica se já existe outro cliente com esse telefone
      if (customerData.phone) {
        const existingCustomer = await CustomerModel.findOne({ 
          phone: customerData.phone,
          _id: { $ne: id }
        }).exec();
        
        if (existingCustomer) {
          console.log(`Outro cliente já usa o telefone ${customerData.phone}. Atualização não permitida.`);
          throw new Error(`Telefone ${customerData.phone} já está em uso por outro cliente.`);
        }
      }
      
      const updatedCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { ...customerData, updatedAt: new Date() },
        { new: true }
      ).exec();
      
      if (!updatedCustomer) {
        console.log(`Cliente com ID ${id} não encontrado para atualização`);
        return null;
      }
      
      console.log(`Cliente com ID ${id} atualizado com sucesso:`, updatedCustomer);
      return this.mapToEntity(updatedCustomer);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao atualizar cliente com ID ${id}:`, err.message);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    console.log(`Tentando excluir cliente com ID ${id}`);
    try {
      const result = await CustomerModel.findByIdAndDelete(id).exec();
      
      const deleted = !!result;
      console.log(`Cliente com ID ${id} ${deleted ? 'excluído com sucesso' : 'não encontrado'}`);
      
      return deleted;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao excluir cliente com ID ${id}:`, err.message);
      return false;
    }
  }

  async findByEmail(email: string): Promise<Customer | null> {
    console.log(`Buscando cliente com email ${email}`);
    try {
      const customer = await CustomerModel.findOne({ email }).exec();
      
      if (!customer) {
        console.log(`Cliente com email ${email} não encontrado`);
        return null;
      }
      
      console.log(`Cliente com email ${email} encontrado:`, customer);
      return this.mapToEntity(customer);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao buscar cliente com email ${email}:`, err.message);
      return null;
    }
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    console.log(`Buscando cliente com telefone ${phone}`);
    try {
      const customer = await CustomerModel.findOne({ phone }).exec();
      
      if (!customer) {
        console.log(`Cliente com telefone ${phone} não encontrado`);
        return null;
      }
      
      console.log(`Cliente com telefone ${phone} encontrado:`, customer);
      return this.mapToEntity(customer);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao buscar cliente com telefone ${phone}:`, err.message);
      return null;
    }
  }

  async findByName(name: string): Promise<Customer | null> {
    console.log(`Buscando cliente com nome ${name}`);
    try {
      const customer = await CustomerModel.findOne({ name }).exec();
      
      if (!customer) {
        console.log(`Cliente com nome ${name} não encontrado`);
        return null;
      }
      
      console.log(`Cliente com nome ${name} encontrado:`, customer);
      return this.mapToEntity(customer);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Erro ao buscar cliente com nome ${name}:`, err.message);
      return null;
    }
  }

  private mapToEntity(document: any): Customer {
    return {
      id: document._id.toString(),
      name: document.name,
      email: document.email,
      phone: document.phone,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }
}