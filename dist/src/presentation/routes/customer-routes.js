"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = require("express");
const customerRoutes = (controller) => {
    const router = (0, express_1.Router)();
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
exports.customerRoutes = customerRoutes;
