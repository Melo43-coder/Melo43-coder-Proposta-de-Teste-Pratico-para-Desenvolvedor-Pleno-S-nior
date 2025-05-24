// src/infrastructure/messaging/kafka/connection.ts
import { Kafka } from 'kafkajs';
import { config } from '../../config/environment';

export const createKafkaClient = (brokers: string[]): Kafka | null => {
  // Verifica se deve usar o mock antes de tentar criar o cliente
  if (config.development && config.development.useMockKafka) {
    console.log('Configurado para usar mock Kafka. Pulando criação do cliente real.');
    return null;
  }
  
  return new Kafka({
    clientId: 'customer-service',
    brokers
  });
};