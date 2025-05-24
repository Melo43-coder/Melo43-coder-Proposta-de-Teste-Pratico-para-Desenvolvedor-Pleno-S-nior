import { Request, Response } from 'express';
import { CustomerService } from '../../application/services/customer.service';

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const customerData = req.body;
      
      // Validação básica
      if (!customerData.name || !customerData.email || !customerData.phone) {
        res.status(400).json({ 
          success: false,
          message: 'Nome, email e telefone são obrigatórios' 
        });
        return;
      }
      
      const createdCustomer = await this.customerService.createCustomer(customerData);
      
      res.status(201).json({
        success: true,
        data: createdCustomer,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);
      
      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this.customerService.getAllCustomers();
      
      res.status(200).json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customerData = req.body;
      
      const updatedCustomer = await this.customerService.updateCustomer(id, customerData);
      
      if (!updatedCustomer) {
        res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: updatedCustomer,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      
      // Se for erro de dados duplicados
      if (error instanceof Error && 
         (error.message.includes('já está em uso') || 
          error.message.includes('duplicado'))) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.customerService.deleteCustomer(id);
      
      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Cliente excluído com sucesso'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }
}