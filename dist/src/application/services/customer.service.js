"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
class CustomerService {
    constructor(customerRepository, cacheService, producerService) {
        this.customerRepository = customerRepository;
        this.cacheService = cacheService;
        this.producerService = producerService;
    }
    async createCustomer(customerData) {
        try {
            // Verifica se já existe um cliente com o mesmo email
            if (customerData.email) {
                const existingByEmail = await this.getCustomerByEmail(customerData.email);
                if (existingByEmail) {
                    console.log(`Cliente com email ${customerData.email} já existe.`);
                    return existingByEmail;
                }
            }
            // Verifica se já existe um cliente com o mesmo telefone
            if (customerData.phone) {
                const existingByPhone = await this.getCustomerByPhone(customerData.phone);
                if (existingByPhone) {
                    console.log(`Cliente com telefone ${customerData.phone} já existe.`);
                    return existingByPhone;
                }
            }
            const customer = {
                ...customerData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const createdCustomer = await this.customerRepository.create(customer);
            // Invalida o cache
            await this.cacheService.invalidatePattern('customer:*');
            // Publica evento
            await this.producerService.sendMessage('customer-created', {
                id: createdCustomer.id,
                name: createdCustomer.name,
                email: createdCustomer.email,
                phone: createdCustomer.phone,
                timestamp: new Date().toISOString()
            });
            return createdCustomer;
        }
        catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }
    async updateCustomer(id, customerData) {
        try {
            // Se estiver atualizando o email, verifica se já existe outro cliente com esse email
            if (customerData.email) {
                const existingCustomer = await this.getCustomerByEmail(customerData.email);
                if (existingCustomer && existingCustomer.id !== id) {
                    throw new Error(`Email ${customerData.email} já está em uso por outro cliente.`);
                }
            }
            // Se estiver atualizando o telefone, verifica se já existe outro cliente com esse telefone
            if (customerData.phone) {
                const existingCustomer = await this.getCustomerByPhone(customerData.phone);
                if (existingCustomer && existingCustomer.id !== id) {
                    throw new Error(`Telefone ${customerData.phone} já está em uso por outro cliente.`);
                }
            }
            const updatedCustomer = await this.customerRepository.update(id, customerData);
            if (!updatedCustomer) {
                return null;
            }
            // Invalida o cache
            await this.cacheService.delete(`customer:${id}`);
            await this.cacheService.invalidatePattern('customer:*');
            // Publica evento
            await this.producerService.sendMessage('customer-updated', {
                id: updatedCustomer.id,
                name: updatedCustomer.name,
                email: updatedCustomer.email,
                phone: updatedCustomer.phone,
                timestamp: new Date().toISOString()
            });
            return updatedCustomer;
        }
        catch (error) {
            console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
            throw error;
        }
    }
    async getCustomerById(id) {
        try {
            // Tenta obter do cache
            const cacheKey = `customer:${id}`;
            const cachedCustomer = await this.cacheService.get(cacheKey);
            if (cachedCustomer) {
                return cachedCustomer;
            }
            // Se não estiver no cache, busca do repositório
            const customer = await this.customerRepository.findById(id);
            if (!customer) {
                return null;
            }
            // Armazena no cache
            await this.cacheService.set(cacheKey, customer, 3600); // Cache por 1 hora
            return customer;
        }
        catch (error) {
            console.error(`Erro ao buscar cliente com ID ${id}:`, error);
            return null;
        }
    }
    async getAllCustomers() {
        try {
            // Tenta obter do cache
            const cacheKey = 'customer:all';
            const cachedCustomers = await this.cacheService.get(cacheKey);
            if (cachedCustomers) {
                return cachedCustomers;
            }
            // Se não estiver no cache, busca do repositório
            const customers = await this.customerRepository.findAll();
            // Armazena no cache
            await this.cacheService.set(cacheKey, customers, 3600); // Cache por 1 hora
            return customers;
        }
        catch (error) {
            console.error('Erro ao buscar todos os clientes:', error);
            return [];
        }
    }
    async deleteCustomer(id) {
        try {
            const deleted = await this.customerRepository.delete(id);
            if (deleted) {
                // Invalida o cache
                await this.cacheService.delete(`customer:${id}`);
                await this.cacheService.invalidatePattern('customer:*');
                // Publica evento
                await this.producerService.sendMessage('customer-deleted', {
                    id,
                    timestamp: new Date().toISOString()
                });
            }
            return deleted;
        }
        catch (error) {
            console.error(`Erro ao excluir cliente com ID ${id}:`, error);
            return false;
        }
    }
    async getCustomerByEmail(email) {
        try {
            // Tenta obter do cache
            const cacheKey = `customer:email:${email}`;
            const cachedCustomer = await this.cacheService.get(cacheKey);
            if (cachedCustomer) {
                return cachedCustomer;
            }
            // Se não estiver no cache, busca do repositório
            const customer = await this.customerRepository.findByEmail(email);
            if (!customer) {
                return null;
            }
            // Armazena no cache
            await this.cacheService.set(cacheKey, customer, 3600); // Cache por 1 hora
            return customer;
        }
        catch (error) {
            console.error(`Erro ao buscar cliente com email ${email}:`, error);
            return null;
        }
    }
    async getCustomerByPhone(phone) {
        try {
            // Tenta obter do cache
            const cacheKey = `customer:phone:${phone}`;
            const cachedCustomer = await this.cacheService.get(cacheKey);
            if (cachedCustomer) {
                return cachedCustomer;
            }
            // Se não estiver no cache, busca do repositório
            const customer = await this.customerRepository.findByPhone(phone);
            if (!customer) {
                return null;
            }
            // Armazena no cache
            await this.cacheService.set(cacheKey, customer, 3600); // Cache por 1 hora
            return customer;
        }
        catch (error) {
            console.error(`Erro ao buscar cliente com telefone ${phone}:`, error);
            return null;
        }
    }
    async getCustomerByName(name) {
        try {
            const customer = await this.customerRepository.findByName(name);
            return customer;
        }
        catch (error) {
            console.error(`Erro ao buscar cliente com nome ${name}:`, error);
            return null;
        }
    }
}
exports.CustomerService = CustomerService;
