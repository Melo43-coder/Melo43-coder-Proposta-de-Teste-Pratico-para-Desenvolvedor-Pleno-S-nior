"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/unit/application/services/customer-service.spec.ts
const customer_service_1 = require("../../../../src/application/services/customer.service");
describe('CustomerService', () => {
    let customerService;
    let mockCustomerRepository;
    let mockCacheService;
    let mockProducerService;
    beforeEach(() => {
        mockCustomerRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByEmail: jest.fn(),
            findByPhone: jest.fn(),
            findByName: jest.fn()
        };
        mockCacheService = {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
            invalidatePattern: jest.fn()
        };
        mockProducerService = {
            sendMessage: jest.fn()
        };
        customerService = new customer_service_1.CustomerService(mockCustomerRepository, mockCacheService, mockProducerService);
    });
    describe('createCustomer', () => {
        it('deve criar um cliente com sucesso', async () => {
            // Arrange
            const customerDto = {
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '1234567890'
            };
            const createdCustomer = {
                id: '123',
                name: customerDto.name,
                email: customerDto.email,
                phone: customerDto.phone,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // Configura os mocks para simular o comportamento esperado
            mockCustomerRepository.findByEmail.mockResolvedValue(null);
            mockCustomerRepository.findByPhone.mockResolvedValue(null);
            mockCustomerRepository.findByName.mockResolvedValue(null);
            mockCustomerRepository.create.mockResolvedValue(createdCustomer);
            // Act
            const result = await customerService.createCustomer(customerDto);
            // Assert
            expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(customerDto.email);
            expect(mockCustomerRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                name: customerDto.name,
                email: customerDto.email,
                phone: customerDto.phone
            }));
            expect(mockCacheService.invalidatePattern).toHaveBeenCalledWith('customer:*');
            expect(mockProducerService.sendMessage).toHaveBeenCalledWith('customer-created', expect.objectContaining({
                id: createdCustomer.id,
                name: createdCustomer.name,
                email: createdCustomer.email
            }));
            expect(result).toEqual(createdCustomer);
        });
        it('deve retornar cliente existente se email já existir', async () => {
            // Arrange
            const customerDto = {
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '1234567890'
            };
            const existingCustomer = {
                id: '123',
                name: 'João Silva (Existente)',
                email: customerDto.email,
                phone: '9876543210',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCustomerRepository.findByEmail.mockResolvedValue(existingCustomer);
            // Act
            const result = await customerService.createCustomer(customerDto);
            // Assert
            expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(customerDto.email);
            expect(mockCustomerRepository.create).not.toHaveBeenCalled();
            expect(result).toEqual(existingCustomer);
        });
        it('deve retornar cliente existente se telefone já existir', async () => {
            // Arrange
            const customerDto = {
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '1234567890'
            };
            const existingCustomer = {
                id: '123',
                name: 'João Silva (Existente)',
                email: 'outro@example.com',
                phone: customerDto.phone,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCustomerRepository.findByEmail.mockResolvedValue(null);
            mockCustomerRepository.findByPhone.mockResolvedValue(existingCustomer);
            // Act
            const result = await customerService.createCustomer(customerDto);
            // Assert
            expect(mockCustomerRepository.findByPhone).toHaveBeenCalledWith(customerDto.phone);
            expect(mockCustomerRepository.create).not.toHaveBeenCalled();
            expect(result).toEqual(existingCustomer);
        });
    });
    describe('getCustomerById', () => {
        it('deve retornar cliente do cache se disponível', async () => {
            // Arrange
            const customerId = '123';
            const cachedCustomer = {
                id: customerId,
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '1234567890',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCacheService.get.mockResolvedValue(cachedCustomer);
            // Act
            const result = await customerService.getCustomerById(customerId);
            // Assert
            expect(mockCacheService.get).toHaveBeenCalledWith(`customer:${customerId}`);
            expect(mockCustomerRepository.findById).not.toHaveBeenCalled();
            expect(result).toEqual(cachedCustomer);
        });
        it('deve buscar cliente do repositório se não estiver no cache', async () => {
            // Arrange
            const customerId = '123';
            const customer = {
                id: customerId,
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '1234567890',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCacheService.get.mockResolvedValue(null);
            mockCustomerRepository.findById.mockResolvedValue(customer);
            // Act
            const result = await customerService.getCustomerById(customerId);
            // Assert
            expect(mockCacheService.get).toHaveBeenCalledWith(`customer:${customerId}`);
            expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
            expect(mockCacheService.set).toHaveBeenCalledWith(`customer:${customerId}`, customer, expect.any(Number));
            expect(result).toEqual(customer);
        });
        it('deve retornar null se cliente não for encontrado', async () => {
            // Arrange
            const customerId = '123';
            mockCacheService.get.mockResolvedValue(null);
            mockCustomerRepository.findById.mockResolvedValue(null);
            // Act
            const result = await customerService.getCustomerById(customerId);
            // Assert
            expect(result).toBeNull();
            expect(mockCacheService.get).toHaveBeenCalledWith(`customer:${customerId}`);
            expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
            expect(mockCacheService.set).not.toHaveBeenCalled();
        });
    });
    describe('getAllCustomers', () => {
        it('deve retornar clientes do cache se disponíveis', async () => {
            // Arrange
            const cachedCustomers = [
                {
                    id: '123',
                    name: 'João Silva',
                    email: 'joao@example.com',
                    phone: '1234567890',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '456',
                    name: 'Maria Souza',
                    email: 'maria@example.com',
                    phone: '0987654321',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            mockCacheService.get.mockResolvedValue(cachedCustomers);
            // Act
            const result = await customerService.getAllCustomers();
            // Assert
            expect(mockCacheService.get).toHaveBeenCalledWith('customer:all');
            expect(mockCustomerRepository.findAll).not.toHaveBeenCalled();
            expect(result).toEqual(cachedCustomers);
        });
        it('deve buscar clientes do repositório se não estiverem no cache', async () => {
            // Arrange
            const customers = [
                {
                    id: '123',
                    name: 'João Silva',
                    email: 'joao@example.com',
                    phone: '1234567890',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '456',
                    name: 'Maria Souza',
                    email: 'maria@example.com',
                    phone: '0987654321',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            mockCacheService.get.mockResolvedValue(null);
            mockCustomerRepository.findAll.mockResolvedValue(customers);
            // Act
            const result = await customerService.getAllCustomers();
            // Assert
            expect(mockCacheService.get).toHaveBeenCalledWith('customer:all');
            expect(mockCustomerRepository.findAll).toHaveBeenCalled();
            expect(mockCacheService.set).toHaveBeenCalledWith('customer:all', customers, expect.any(Number));
            expect(result).toEqual(customers);
        });
    });
    describe('updateCustomer', () => {
        it('deve atualizar um cliente com sucesso', async () => {
            // Arrange
            const customerId = '123';
            const updateData = {
                name: 'João Silva Atualizado',
                email: 'joao.atualizado@example.com'
            };
            const updatedCustomer = {
                id: customerId,
                name: updateData.name,
                email: updateData.email,
                phone: '1234567890',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCustomerRepository.findByEmail.mockResolvedValue(null);
            mockCustomerRepository.update.mockResolvedValue(updatedCustomer);
            // Act
            const result = await customerService.updateCustomer(customerId, updateData);
            // Assert
            expect(mockCustomerRepository.update).toHaveBeenCalledWith(customerId, updateData);
            expect(mockCacheService.delete).toHaveBeenCalledWith(`customer:${customerId}`);
            expect(mockCacheService.invalidatePattern).toHaveBeenCalledWith('customer:*');
            expect(mockProducerService.sendMessage).toHaveBeenCalledWith('customer-updated', expect.any(Object));
            expect(result).toEqual(updatedCustomer);
        });
        it('deve retornar null se cliente não existir', async () => {
            // Arrange
            const customerId = '123';
            const updateData = {
                name: 'João Silva Atualizado'
            };
            mockCustomerRepository.update.mockResolvedValue(null);
            // Act
            const result = await customerService.updateCustomer(customerId, updateData);
            // Assert
            expect(result).toBeNull();
            expect(mockCustomerRepository.update).toHaveBeenCalledWith(customerId, updateData);
        });
    });
    describe('deleteCustomer', () => {
        it('deve excluir um cliente com sucesso', async () => {
            // Arrange
            const customerId = '123';
            mockCustomerRepository.delete.mockResolvedValue(true);
            // Act
            const result = await customerService.deleteCustomer(customerId);
            // Assert
            expect(result).toBe(true);
            expect(mockCustomerRepository.delete).toHaveBeenCalledWith(customerId);
            expect(mockCacheService.delete).toHaveBeenCalledWith(`customer:${customerId}`);
            expect(mockCacheService.invalidatePattern).toHaveBeenCalledWith('customer:*');
            expect(mockProducerService.sendMessage).toHaveBeenCalledWith('customer-deleted', expect.objectContaining({
                id: customerId
            }));
        });
        it('deve retornar false se cliente não existir', async () => {
            // Arrange
            const customerId = '123';
            mockCustomerRepository.delete.mockResolvedValue(false);
            // Act
            const result = await customerService.deleteCustomer(customerId);
            // Assert
            expect(result).toBe(false);
            expect(mockCustomerRepository.delete).toHaveBeenCalledWith(customerId);
            expect(mockCacheService.delete).not.toHaveBeenCalled();
            expect(mockCacheService.invalidatePattern).not.toHaveBeenCalled();
            expect(mockProducerService.sendMessage).not.toHaveBeenCalled();
        });
    });
});
