// src/main.ts
import express from 'express';
import { config } from './infrastructure/config/environment';
import { connectToDatabase, closeDatabase } from './infrastructure/database/mongodb/connection';
import { MongoCustomerRepository } from './infrastructure/database/mongodb/repositories/costumer-repository';
import { CustomerService } from './application/services/customer.service';
import { CustomerController } from './presentation/controllers/customer-controller';
import { customerRoutes } from './presentation/routes/customer-routes';
import { MockCacheService } from './infrastructure/cache/redis/cache-service';
import { MockProducerService } from './infrastructure/messaging/kafka/producer';

async function bootstrap() {
  try {
    // Conecta ao MongoDB
    await connectToDatabase();
    
    // Cria instâncias dos serviços mock para desenvolvimento
    const cacheService = new MockCacheService();
    const producerService = new MockProducerService();
    
    // Cria repositórios
    const customerRepository = new MongoCustomerRepository();
    
    // Cria serviços de aplicação
    const customerService = new CustomerService(
      customerRepository,
      cacheService,
      producerService
    );
    
    // Cria controladores com a injeção do serviço
    const customerController = new CustomerController(customerService);
    
    // Configura Express
    const app = express();
    app.use(express.json());
    
    // Configura rotas
    app.use('/api/customers', customerRoutes(customerController));
    
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
      } catch (error) {
        console.error('Erro no teste de MongoDB:', error);
        res.status(500).json({
          status: 'error',
          message: 'Falha no teste de MongoDB',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    });
    
    // Middleware de erro global
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Erro não tratado:', err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    });
    
    // Inicia o servidor
    const port = config.port || 3000;
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
        await closeDatabase();
        
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
    
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap().catch(console.error);