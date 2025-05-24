// src/presentation/middlewares/validation.midddleware.ts

import { Request, Response, NextFunction } from 'express';

// Interface para definir as regras de validação
interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { [key: string]: string } = {};

    rules.forEach(rule => {
      const value = req.body[rule.field];
      
      // Verifica se o campo é obrigatório
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[rule.field] = rule.message || `O campo ${rule.field} é obrigatório`;
        return;
      }

      // Se o valor não existe e não é obrigatório, pula as outras validações
      if (value === undefined || value === null) {
        return;
      }

      // Verifica o comprimento mínimo
      if (rule.minLength !== undefined && typeof value === 'string' && value.length < rule.minLength) {
        errors[rule.field] = rule.message || `O campo ${rule.field} deve ter pelo menos ${rule.minLength} caracteres`;
      }

      // Verifica o comprimento máximo
      if (rule.maxLength !== undefined && typeof value === 'string' && value.length > rule.maxLength) {
        errors[rule.field] = rule.message || `O campo ${rule.field} deve ter no máximo ${rule.maxLength} caracteres`;
      }

      // Verifica o padrão (regex)
      if (rule.pattern !== undefined && typeof value === 'string' && !rule.pattern.test(value)) {
        errors[rule.field] = rule.message || `O campo ${rule.field} está em formato inválido`;
      }
    });

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors });
      return; // Adicionado return para encerrar a função após enviar a resposta
    }

    next();
  };
};