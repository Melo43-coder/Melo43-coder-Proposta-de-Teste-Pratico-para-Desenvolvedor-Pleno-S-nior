"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = void 0;
// Configura a conexão com o Redis
const redis_1 = require("redis");
const createRedisClient = (url) => {
    const client = (0, redis_1.createClient)({ url });
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Connected to Redis'));
    return client;
};
exports.createRedisClient = createRedisClient;
