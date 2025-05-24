// Configura a conexão com o Redis
import { createClient } from 'redis';

export const createRedisClient = (url: string) => {
  const client = createClient({ url });
  
  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect', () => console.log('Connected to Redis'));
  
  return client;
};