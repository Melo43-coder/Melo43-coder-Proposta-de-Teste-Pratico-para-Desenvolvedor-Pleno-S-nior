import { Router } from 'express';
import { CustomerController } from '../controllers/customer-controller';

export const customerRoutes = (controller: CustomerController): Router => {
  const router = Router();
  
  // Cria um novo cliente
  router.post('/', controller.create.bind(controller));
  
  // Atualiza um cliente existente
  router.put('/:id', controller.update.bind(controller));
  
  // Busca um cliente pelo ID
  router.get('/:id', controller.getById.bind(controller));
  
  // Busca todos os clientes
  router.get('/', controller.getAll.bind(controller));
  
  // Exclui um cliente
  router.delete('/:id', controller.delete.bind(controller));
  
  return router;
};