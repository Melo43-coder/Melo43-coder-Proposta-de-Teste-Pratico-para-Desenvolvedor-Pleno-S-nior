"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main.ts
const express_1 = __importDefault(require("express"));
const environment_1 = require("./infrastructure/config/environment");
const connection_1 = require("./infrastructure/database/mongodb/connection");
const costumer_repository_1 = require("./infrastructure/database/mongodb/repositories/costumer-repository");
const customer_service_1 = require("./application/services/customer.service");
const customer_controller_1 = require("./presentation/controllers/customer-controller");
const customer_routes_1 = require("./presentation/routes/customer-routes");
const cache_service_1 = require("./infrastructure/cache/redis/cache-service");
const producer_1 = require("./infrastructure/messaging/kafka/producer");
async function bootstrap() {
    try {
        // Conecta ao MongoDB
        await (0, connection_1.connectToDatabase)();
        // Cria instâncias dos serviços mock para desenvolvimento
        const cacheService = new cache_service_1.MockCacheService();
        const producerService = new producer_1.MockProducerService();
        // Cria repositórios
        const customerRepository = new costumer_repository_1.MongoCustomerRepository();
        // Cria serviços de aplicação
        const customerService = new customer_service_1.CustomerService(customerRepository, cacheService, producerService);
        // Cria controladores com a injeção do serviço
        const customerController = new customer_controller_1.CustomerController(customerService);
        // Configura Express
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Configura rotas
        app.use('/api/customers', (0, customer_routes_1.customerRoutes)(customerController));
        // Rota de saúde
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', time: new Date().toISOString() });
        });
        // Rota de teste para o MongoDB
        app.get('/test-mongodb', async (req, res) => {
            try {
                // Cria um cliente de teste
                const testCustomer = await customerService.createCustomer({
                    name: `Teste ${Date.now()}`,
                    email: `teste${Date.now()}@example.com`,
                    phone: `${Math.floor(Math.random() * 1000000000)}`
                });
                // Busca todos os clientes
                const allCustomers = await customerService.getAllCustomers();
                res.status(200).json({
                    status: 'success',
                    message: 'Teste de MongoDB concluído com sucesso',
                    testCustomer,
                    customerCount: allCustomers.length
                });
            }
            catch (error) {
                console.error('Erro no teste de MongoDB:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Falha no teste de MongoDB',
                    error: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        });
        // Middleware de erro global
        app.use((err, req, res, next) => {
            console.error('Erro não tratado:', err);
            res.status(500).json({ message: 'Erro interno do servidor' });
        });
        // Inicia o servidor
        const port = environment_1.config.port || 3000;
        const server = app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            console.log(`Acesse http://localhost:${port}/health para verificar o status`);
            console.log(`Acesse http://localhost:${port}/test-mongodb para testar a conexão com o MongoDB`);
        });
        // Tratamento de encerramento
        const shutdown = async () => {
            console.log('Encerrando servidor...');
            server.close(async () => {
                console.log('Servidor HTTP encerrado');
                // Desconecta do MongoDB
                await (0, connection_1.closeDatabase)();
                console.log('Todos os serviços desconectados');
                process.exit(0);
            });
            setTimeout(() => {
                console.error('Encerramento forçado após timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('Erro ao iniciar a aplicação:', error);
        process.exit(1);
    }
}
bootstrap().catch(console.error);
