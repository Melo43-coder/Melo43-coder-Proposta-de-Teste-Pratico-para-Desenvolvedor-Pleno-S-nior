"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKafkaClient = void 0;
// src/infrastructure/messaging/kafka/connection.ts
const kafkajs_1 = require("kafkajs");
const environment_1 = require("../../config/environment");
const createKafkaClient = (brokers) => {
    // Verifica se deve usar o mock antes de tentar criar o cliente
    if (environment_1.config.development && environment_1.config.development.useMockKafka) {
        console.log('Configurado para usar mock Kafka. Pulando criação do cliente real.');
        return null;
    }
    return new kafkajs_1.Kafka({
        clientId: 'customer-service',
        brokers
    });
};
exports.createKafkaClient = createKafkaClient;
