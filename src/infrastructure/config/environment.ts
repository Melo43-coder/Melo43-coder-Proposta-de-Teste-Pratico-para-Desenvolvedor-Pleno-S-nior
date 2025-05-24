// src/infrastructure/config/environment.ts

import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/customer-service'
  },
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379'
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
  },
  development: {
    useMockRedis: process.env.USE_MOCK_REDIS === 'true',
    useMockKafka: process.env.USE_MOCK_KAFKA === 'true'
  }
};